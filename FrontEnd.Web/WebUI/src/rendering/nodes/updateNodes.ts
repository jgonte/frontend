import areEquivalent from "../../utils/areEquivalent";
import { assert } from "../../utils/assert";
import isPrimitive from "../../utils/isPrimitive";
import isUndefinedOrNull from "../../utils/isUndefinedOrNull";
import { beginMarker } from "../template/markers";
import addPatcherComparer from "../utils/addPatcherComparer";
import transferPatchingData from "../utils/transferPatchingData";
import createNodes from "./createNodes";
import { mountNode, mountNodes } from "./mountNodes";
import { AnyPatchedNode, NodePatchingData, PatchedChildNode } from "./NodePatchingData";

addPatcherComparer();

/**
 * Updates an existing node described by oldPatchingData (single patching data) 
 * with the node (or nodes) described by newPatchingData
 * @param p Parent node
 * @param oldPd Patching information about the old parent node
 * @param newPd Single or an array of patching information of the new one(s)
 */
export function updateNode(
    p: Node,
    oldPd: NodePatchingData,
    newPd: NodePatchingData | NodePatchingData[]
) {

    if (areEquivalent(oldPd, newPd)) {

        transferPatchingData(oldPd, newPd);

        return;
    }

    const node = oldPd.node as PatchedChildNode;

    // It can have multiple text nodes that get concatenated
    //assert.isTrue([0, 1].includes(Array.from(p.childNodes).filter(n => n instanceof Text).length), 'Only a single text node');

    assert.isTrue(!isUndefinedOrNull(node), 'There must be an existing node');

    // p can be a marker node
    //assert.areEqual(node, p.childNodes[0], 'Must be same node');

    if (Array.isArray(newPd)) {

        node.remove();

        mountNodes(p, newPd);
    }
    else if (isUndefinedOrNull(newPd)) {

        node.remove();
    }
    else if (isPrimitive(newPd)) {

        //TODO: Find the text element as the list of children or come with some kind of primitive wrapper
        (node as unknown as Text).textContent = newPd.toString();
    }
    else { // newPatchingData is a single node too

        const {
            patcher: oldPatcher,
            values: oldValues,
            rules
        } = oldPd;

        const {
            patcher,
            values
        } = newPd;

        if (oldPatcher === patcher) {

            newPd.rules = rules; // Set the compiled rules in the new patched data

            newPd.node = node as AnyPatchedNode; // Set the node in the new patching data

            if (areEquivalent(oldPd.values, newPd.values)) {

                transferPatchingData(
                    oldPd.values as NodePatchingData[],
                    newPd.values as NodePatchingData[]
                );

                return; // Same patcher and same values means no changes to apply
            }

            oldPatcher.patchNode(rules || [], oldValues, values);

            node._$patchingData = newPd;
        }
        else { // Different type of node, replace it with a new one

            const newNode = createNodes(newPd);

            if ((node as unknown as Comment).data === beginMarker) {

                (node.nextSibling as HTMLElement).remove(); // Remove the end marker as well
            }

            p.replaceChild(newNode, node); // Replace the end marker with the node      
        }
    }
}

/**
 * Updates an existing node described by an array of oldPatchingData (single patching data) 
 * with the node (or nodes) described by newPatchingData
 * @param p Parent node
 * @param oldPd Array of patching information about the old parent node
 * @param newPd Single or an array of patching information of the new one(s)
 */
export function updateNodes(
    p: Node,
    oldPd: NodePatchingData[],
    newPd: NodePatchingData | NodePatchingData[]
) {

    if (areEquivalent(oldPd, newPd)) {

        transferPatchingData(oldPd, newPd);

        return;
    }

    if (Array.isArray(newPd)) {

        updateArrayNodes(p, oldPd, newPd);
    }
    else if (isPrimitive(newPd)) {

        //TODO: Find the text element as the list of children or come with some kind of primitive wrapper
        (p.childNodes[p.childNodes.length - 1] as Text).textContent = newPd.toString();
    }
    else if (isUndefinedOrNull(newPd)) {

        removeAllNodes(p);
    }
    else { // Single node

        removeAllNodes(p);

        mountNode(p, newPd);
    }
}

/**
 * Correlates two arrays of patching information in order to patch the specific nodes accordingly
 * @param p Parent node
 * @param oldPd Array of patching information about the old nodes
 * @param newPd Array of patching information about new ones
 */
function updateArrayNodes(
    p: Node,
    oldPd: NodePatchingData[],
    newPd: NodePatchingData[]
) {

    let { length: oldCount } = oldPd;

    // Map the keyed nodes from the old children nodes
    const keyedNodes = new Map<string, AnyPatchedNode>();

    for (let i = 0; i < oldCount; ++i) {

        const oldChild = oldPd[i].node as HTMLElement;

        // if (oldChild === undefined) { // Not a patching data

        //     continue;
        // }

        const key = oldChild.getAttribute?.('key') || null;

        if (key !== null) {

            keyedNodes.set(key, oldChild as AnyPatchedNode);
        }
    }

    const { length: newCount } = newPd;

    for (let i = 0; i < newCount; ++i) {

        const oldChild = i < oldPd.length ?
            oldPd[i].node as HTMLElement :
            undefined;

        if (oldChild === undefined) { // Mount the child

            mountNode(p, newPd[i]);
        }
        else { // oldChild !== undefined

            const newChildPd = newPd[i];

            const {
                patcher,
                values
            } = newChildPd;

            // Check for any keyed patching data
            const {
                keyIndex
            } = patcher;

            const valueKey = keyIndex !== undefined ?
                values[keyIndex]?.toString() :
                null;

            // Compare against a keyed node
            const oldChildKey = oldChild.getAttribute?.('key') || null;

            if (oldChildKey === valueKey) { // If the keys are the same patch the node with that patching data    

                updateNode(oldChild, oldPd[i], newChildPd);

                if (i >= p.childNodes.length) { // The child was removed when replacing the nodes

                    p.appendChild(oldChild);
                }
            }
            else { // oldChildKey !== valueKey - Find the node that corresponds with the keyed patching data

                if (keyedNodes.has(valueKey as string)) { // Find an existing keyed node

                    const keyedNode = keyedNodes.get(valueKey as string) as AnyPatchedNode;

                    // If the values of the keyed node match the ones of the oldChild then just swap them
                    if (areEquivalent(
                        newChildPd.values,
                        (keyedNode._$patchingData as NodePatchingData).values)) {

                        if (i >= p.childNodes.length) {

                            p.appendChild(keyedNode);
                        }
                        else { // Replace the node

                            p.childNodes[i].replaceWith(keyedNode);

                            --oldCount; // It removes the child from the existing children
                        }

                        newChildPd.node = keyedNode; // Set the node of the new patching data

                        const {
                            rules,
                            values
                        } = keyedNode._$patchingData as NodePatchingData;

                        newChildPd.rules = rules;

                        newChildPd.values = values; // Ensure we pass the child values with the attached nodes if any
                    }
                    // else { // Some value has changed, patch the existing node

                    //     updateNodes(oldChild, oldPatchingData[i], (keyedNode as any)._$patchingData);
                    // }
                }
                else { // No keyed node found, set the new child

                    updateNode(oldChild, oldPd[i], newChildPd);
                }
            }
        }
    }

    // Remove the extra nodes
    for (let i = oldCount - 1; i >= newCount; --i) {

        (oldPd[i].node as HTMLElement).remove();
    }
}

/**
 * Removes all the children nodes from the parent
 * @param p Parent node
 */
function removeAllNodes(p: Node) {

    while (p.firstChild) {

        p.removeChild(p.firstChild);
    }
}

