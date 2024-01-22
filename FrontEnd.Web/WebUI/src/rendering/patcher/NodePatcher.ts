import { INodePatcher } from "./INodePatcher";
import isPrimitive from "../../utils/isPrimitive";
import isUndefinedOrNull from "../../utils/isUndefinedOrNull";
import { mountNodeBefore, mountNodesBefore } from "../nodes/mountNodes";
import { ExtensibleHTMLElement, NodePatchingData, NodePatchingDataValues } from "../nodes/NodePatchingData";
import { CompiledNodePatcherRule } from "../rules/CompiledNodePatcherRule";
import createNodePatcherRules from "../rules/createNodePatcherRules";
import { CompiledNodePatcherAttributeRule } from "../rules/NodePatcherAttributeRule";
import { NodePatcherRule, NodePatcherRuleTypes } from "../rules/NodePatcherRule";
import createTemplate from "../template/createTemplate";
import setAttribute from "../dom/setAttribute";
import { CompiledNodePatcherEventRule } from "../rules/NodePatcherEventRule";
import { updateNode } from "../nodes/updateNodes";
import replaceChild from "../dom/replaceChild";
import removeLeftSiblings from "../dom/removeLeftSiblings";
import removeLeftSibling from "../dom/removeLeftSibling";
import { setEvent } from "../dom/setEvent";
import areEquivalent from "../../utils/areEquivalent";
import addPatcherComparer from "../utils/addPatcherComparer";
import { attributeMarkerPrefix } from "../template/markers";
import isNodePatchingData from "../utils/isNodePatchingData";
import transferPatchingData from "../utils/transferPatchingData";

addPatcherComparer();

export default class NodePatcher implements INodePatcher {

    /**
     * The inner HTML of the template content to help debugging
     */
    templateString: string;

    /**
     * The template to clone and generate the node from
     */
    template: HTMLTemplateElement;

    /**
     * The rules to be cloned (compiled)to execute the patching
     */
    rules: NodePatcherRule[];

    /**
     * The index of the dynamic property where the key is
     */
    keyIndex?: number;

    /**
     * Whether the content of the template has a single element
     */
    isSingleElement: boolean;

    constructor(strings: TemplateStringsArray) {

        const {
            templateString,
            template,
            keyIndex
        } = createTemplate(strings);

        this.templateString = templateString; // To make debugging easier

        this.template = template;

        const childNodes = template.content.childNodes;

        this.isSingleElement = childNodes.length === 1 &&
            childNodes[0].nodeType === Node.ELEMENT_NODE;

        this.rules = createNodePatcherRules(template.content);

        this.keyIndex = keyIndex;
    }

    /**
     * First time the component was rendered, there are no existing nodes
     * @param rules Rules to perform a specific patch
     * @param values Values to create the nodes from
     */
    firstPatch(
        rules: CompiledNodePatcherRule[],
        values: NodePatchingDataValues = []
    ): void {

        const {
            length
        } = rules;

        // The index of the values of the rules match 1 to 1 with the number of rules
        for (let i = 0; i < length; ++i) {

            const value = values[i];

            const rule = rules[i];

            const node = rule.node as HTMLElement;

            // Track the attributes that are not initialized to remove them
            const attributeNames = node.getAttributeNames !== undefined ?
                node.getAttributeNames() :
                undefined;

            const attributesNotSet = new Set(attributeNames);

            switch (rule.type) {

                case NodePatcherRuleTypes.PATCH_CHILDREN:
                    {
                        const parentNode = node.parentNode as Node;

                        if (Array.isArray(value)) {

                            mountNodesBefore(parentNode, node, value as NodePatchingData[]);
                        }
                        else if (!isUndefinedOrNull(value)) { // Single value

                            mountNodeBefore(parentNode, node, value as NodePatchingData);
                        }
                        // else {
                        //     // Nothing to mount
                        // }
                    }
                    break;
                case NodePatcherRuleTypes.PATCH_ATTRIBUTE:
                    {
                        const {
                            name,
                            property
                        } = rule as CompiledNodePatcherAttributeRule;

                        setAttribute(node as ExtensibleHTMLElement, name, property, value);

                        attributesNotSet.delete(name);
                    }
                    break;
                case NodePatcherRuleTypes.PATCH_EVENT:
                    {
                        const {
                            name
                        } = rule as CompiledNodePatcherEventRule;

                        setEvent(name, value, null, node);

                        attributesNotSet.delete(name);
                    }
                    break;
                default: throw new Error(`firstPatch is not implemented for rule type: ${rule.type}`);
            }

            // Remove the uninitialized attributes with markers
            attributesNotSet.forEach(a => {

                const value = node.getAttribute(a);

                if (value?.startsWith(attributeMarkerPrefix)) {

                    node.removeAttribute(a);
                }
            });
        }
    }

    /**
     * Updates the DOM in the node by operating the rules with the old and new values
     * @param rules 
     * @param oldValues 
     * @param newValues 
     */
    patchNode(
        rules: CompiledNodePatcherRule[],
        oldValues: NodePatchingDataValues = [],
        newValues: NodePatchingDataValues = []
    ): void {

        const {
            length
        } = rules;

        // The index of the values of the rules match 1 to 1 with the number of rules
        for (let i = 0; i < length; ++i) {

            const oldValue = oldValues[i];

            const newValue = newValues[i];

            if (areEquivalent(oldValue, newValue)) {

                transferPatchingData(oldValue as NodePatchingData, newValue as NodePatchingData);

                continue;
            }

            const rule = rules[i];

            const {
                type,
                node
            } = rule;

            switch (type) {

                case NodePatcherRuleTypes.PATCH_CHILDREN:
                    {
                        if (Array.isArray(newValue)) {

                            if (Array.isArray(oldValue)) {

                                patchChildren(node, oldValue as NodePatchingData[], newValue as NodePatchingData[]);
                            }
                            else { // New value is a single node, replace it with the array of nodes

                                if (!isUndefinedOrNull(oldValue)) {

                                    removeLeftSibling(node);
                                }

                                mountNodesBefore(node.parentNode as Node, node, newValue as NodePatchingData[]);
                            }
                        }
                        else { // Single node

                            if (!isUndefinedOrNull(newValue)) {

                                if (isUndefinedOrNull(oldValue)) {

                                    mountNodeBefore(node.parentNode as Node, node, newValue as NodePatchingData);
                                }
                                else {

                                    if (isNodePatchingData(oldValue) &&
                                        (oldValue as NodePatchingData).patcher === (newValue as NodePatchingData).patcher) {

                                        updateNode(node, oldValue as NodePatchingData, newValue as NodePatchingData);
                                    }
                                    else {

                                        if (Array.isArray(oldValue)) {

                                            removeLeftSiblings(node);

                                            mountNodeBefore(node.parentNode as Node, node, newValue as NodePatchingData);
                                        }
                                        else { // Old value is single node

                                            replaceChild(node, newValue as NodePatchingData, oldValue as NodePatchingData);
                                        }
                                    }
                                }
                            }
                            else { // newValue === undefined || null

                                if (!isUndefinedOrNull(oldValue)) {

                                    if (Array.isArray(oldValue) || // Several nodes to remove
                                        isNodePatchingData(oldValue)) {

                                        removeLeftSiblings(node);
                                    }
                                    else { // Only one node to remove

                                        removeLeftSibling(node);
                                    }
                                }
                            }
                        }
                    }
                    break;
                case NodePatcherRuleTypes.PATCH_ATTRIBUTE:
                    {
                        const {
                            name,
                            property
                        } = rule as CompiledNodePatcherAttributeRule;

                        setAttribute(node as ExtensibleHTMLElement, name, property, newValue);
                    }
                    break;
                case NodePatcherRuleTypes.PATCH_EVENT:
                    {
                        const {
                            name
                        } = rule as CompiledNodePatcherEventRule;

                        setEvent(name, newValue, oldValue, node);
                    }
                    break;
                default: throw new Error(`patch is not implemented for rule type: ${type}`);
            }
        }
    }
}

function patchChildren(
    markerNode: Node,
    oldPatchingData: NodePatchingData[] = [],
    newPatchingData: NodePatchingData[] = []
): void {

    oldPatchingData = oldPatchingData || [];

    let { length: oldChildrenCount } = oldPatchingData;

    const keyedNodes = MapKeyedNodes(oldPatchingData);

    const { length: newChildrenCount } = newPatchingData;

    for (let i = 0; i < newChildrenCount; ++i) {

        const newChild = newPatchingData[i];

        const newChildKey = getKey(newChild);

        const oldChild = oldPatchingData[i] as NodePatchingData;

        if (oldChild === undefined) { // No more old children

            if (keyedNodes.has(newChildKey)) { // There is an old child with the same key

                const oldChild = keyedNodes.get(newChildKey);

                updateNode(oldChild?.node as ExtensibleHTMLElement, oldChild as NodePatchingData, newChild);
            }
            else { // There is no old child with that key

                mountNodeBefore(markerNode.parentNode as Node, markerNode, newChild as NodePatchingData);

                ++oldChildrenCount; // Update the count of extra nodes to remove
            }
        }
        else { // oldChild !== undefined

            const oldChildKey = getKey(oldChild);

            if (newChildKey === oldChildKey) { // Patch the node

                if (isPrimitive(oldChild)) {

                    replaceChild(markerNode, newChild, oldChild);
                }
                else {

                    updateNode(oldChild?.node as ExtensibleHTMLElement, oldChild as NodePatchingData, newChild);
                }
            }
            else { // newChildKey !== oldChildKey

                if (keyedNodes.has(newChildKey)) { // There is an old child with the same key

                    const oldKeyedChild = keyedNodes.get(newChildKey) as NodePatchingData;

                    updateNode(oldKeyedChild.node as ExtensibleHTMLElement, oldKeyedChild, newChild);

                    replaceChild(markerNode, oldKeyedChild, oldChild);
                }
                else {

                    const existingChild = markerNode.parentNode?.childNodes[i + 1] as ChildNode; // Skip the begin marker node

                    mountNodeBefore(existingChild.parentNode as Node, existingChild, newChild as NodePatchingData);

                    ++oldChildrenCount; // Update the count of extra nodes to remove
                }
            }
        }
    }

    // Remove the extra nodes
    for (let i = oldChildrenCount - 1; i >= newChildrenCount; --i) {

        removeLeftSibling(markerNode);
    }
}

/**
 * Maps the keyed nodes from the old children nodes
 * @param children 
 * @returns 
 */
function MapKeyedNodes(children: NodePatchingData[]) {

    const keyedNodes = new Map<unknown, NodePatchingData>();

    children.forEach(child => {

        const key = getKey(child);

        if (key !== null) {

            keyedNodes.set(key, child);
        }
    });

    return keyedNodes;
}

/**
 * Retrieves the key from the patching data
 * @param patchingData 
 * @returns 
 */
function getKey(patchingData: NodePatchingData): string | null {

    if (isPrimitive(patchingData)) {

        return null;
    }

    const {
        patcher,
        values
    } = patchingData as NodePatchingData;

    const {
        keyIndex
    } = patcher;

    return keyIndex !== undefined ?
        values[keyIndex] as string :
        null;
}