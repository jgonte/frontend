import areEquivalent from "../../utils/areEquivalent";
import isPrimitive from "../../utils/isPrimitive";
import { beginMarker } from "../template/markers";
import addPatcherComparer from "../utils/addPatcherComparer";
import transferPatchingData from "../utils/transferPatchingData";
import createNodes from "./createNodes";
import mountNodes from "./mountNodes";
import { AnyPatchedNode, NodePatchingData } from "./NodePatchingData";

addPatcherComparer();

export default function updateNodes(
    container: Node, 
    oldPatchingData: NodePatchingData | NodePatchingData[], 
    newPatchingData: NodePatchingData | NodePatchingData[]
) {

    if (areEquivalent(oldPatchingData, newPatchingData)) {

        transferPatchingData(oldPatchingData, newPatchingData);

        return;
    }

    if (Array.isArray(newPatchingData)) {

        if (Array.isArray(oldPatchingData)) {

            updateArrayNodes(
                container, 
                oldPatchingData as NodePatchingData[], 
                newPatchingData
            );
        }
        else { // oldPatchingData is a single node

            (oldPatchingData.node as HTMLElement).remove();

            mountNodes(container, newPatchingData);
        }
    }
    else if (isPrimitive(newPatchingData)) {

        //TODO: Find the text element as the list of children or come with some kind of primitive wrapper
        (container.childNodes[container.childNodes.length - 1] as Text).textContent = newPatchingData.toString();
    }
    else {

        if (Array.isArray(oldPatchingData)) {

            removeAllNodes(container);

            mountNodes(container, newPatchingData);
        }
        else {

            const {
                node
            } = oldPatchingData as NodePatchingData;
    
            if (node === undefined) {
    
                throw new Error('There must be an existing node');
            }
    
            const {
                patcher: oldPatcher,
                values: oldValues,
                rules
            } = oldPatchingData as NodePatchingData;
    
            const {
                patcher,
                values
            } = newPatchingData;
    
            if (oldPatcher === patcher) {
    
                newPatchingData.rules = rules; // Set the compiled rules in the new patched data
    
                newPatchingData.node = node; // Set the node in the new patching data
    
                if (areEquivalent(oldPatchingData.values, newPatchingData.values)) {
    
                    transferPatchingData(
                        oldPatchingData.values as NodePatchingData[], 
                        newPatchingData.values as NodePatchingData[]
                    );
    
                    return; // Same patcher and same values mean no changes to apply
                }
    
                oldPatcher.patchNode(rules || [], oldValues, values);
    
                node._$patchingData = newPatchingData;
            }
            else { // Different type of node, replace it with a new one
    
                const newNode = createNodes(newPatchingData);
    
                if ((node as unknown as Comment).data === beginMarker) {
    
                    (node.nextSibling as HTMLElement).remove(); // Remove the end marker as well
                }
    
                container.replaceChild(newNode, node as Node); // Replace the end marker with the node      
            }

        }
        
    }
}

function updateArrayNodes(
    container: Node, 
    oldPatchingData: NodePatchingData[], 
    newPatchingData: NodePatchingData[]
) {

    let { length: oldCount } = oldPatchingData;

    // Map the keyed nodes from the old children nodes
    const keyedNodes = new Map<string, AnyPatchedNode>();

    for (let i = 0; i < oldCount; ++i) {

        const {
            node: oldChild
        } = oldPatchingData[i];

        // if (oldChild === undefined) { // Not a patching data

        //     continue;
        // }

        const key = (oldChild as HTMLElement).getAttribute?.('key') || null;

        if (key !== null) {

            keyedNodes.set(key, oldChild as AnyPatchedNode);
        }
    }

    const { length: newCount } = newPatchingData;

    for (let i = 0; i < newCount; ++i) {

        const oldChild = i < oldPatchingData.length ?
            oldPatchingData[i].node as AnyPatchedNode :
            undefined;

        if (oldChild === undefined) { // Mount the child

            mountNodes(container, newPatchingData[i]);
        }
        else { // oldChild !== undefined

            const newChildPatchingData = newPatchingData[i];

            const {
                patcher,
                values
            } = newChildPatchingData;

            // Check for any keyed patching data
            const {
                keyIndex
            } = patcher;

            const valueKey = keyIndex !== undefined ?
                values[keyIndex]?.toString() :
                null;

            // Compare against a keyed node
            const oldChildKey = (oldChild as unknown as HTMLElement).getAttribute?.('key') || null;

            if (oldChildKey === valueKey) { // If the keys are the same patch the node with that patching data    

                updateNodes(oldChild as Node, oldPatchingData[i], newChildPatchingData);

                if (i >= container.childNodes.length) { // The child was removed when replacing the nodes

                    container.appendChild(oldChild as Node);
                }
            }
            else { // oldChildKey !== valueKey - Find the node that corresponds with the keyed patching data

                if (keyedNodes.has(valueKey as string)) { // Find an existing keyed node

                    const keyedNode = keyedNodes.get(valueKey as string);

                    // If the values of the keyed node match the ones of the oldChild then just swap them
                    if (areEquivalent(
                        newChildPatchingData.values, 
                        ((keyedNode as AnyPatchedNode)._$patchingData as NodePatchingData).values)) {

                        if (i >= container.childNodes.length) {

                            container.appendChild(keyedNode as Node);
                        }
                        else { // Replace the node

                            container.childNodes[i].replaceWith(keyedNode as Node);

                            --oldCount; // It removes the child from the existing children
                        }

                        newChildPatchingData.node = keyedNode as AnyPatchedNode; // Set the node of the new patching data

                        const {
                            rules,
                            values
                        } = (keyedNode as AnyPatchedNode)._$patchingData as NodePatchingData;

                        newChildPatchingData.rules = rules;

                        newChildPatchingData.values = values; // Ensure we pass the child values with the attached nodes if any
                    }
                    // else { // Some value has changed, patch the existing node

                    //     updateNodes(oldChild, oldPatchingData[i], (keyedNode as any)._$patchingData);
                    // }
                }
                else { // No keyed node found, set the new child

                    updateNodes(oldChild as Node, oldPatchingData[i], newChildPatchingData);
                }
            }
        }
    }

    // Remove the extra nodes
    for (let i = oldCount - 1; i >= newCount; --i) {

        (oldPatchingData[i].node as HTMLElement).remove();
    }
}

function removeAllNodes(parent: Node) {
    
    while (parent.firstChild) {
        
        parent.removeChild(parent.firstChild);
    }
}

