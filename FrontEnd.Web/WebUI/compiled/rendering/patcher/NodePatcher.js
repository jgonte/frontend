import isPrimitive from "../../utils/isPrimitive";
import isUndefinedOrNull from "../../utils/isUndefinedOrNull";
import { mountNodeBefore, mountNodesBefore } from "../nodes/mountNodes";
import createNodePatcherRules from "../rules/createNodePatcherRules";
import { NodePatcherRuleTypes } from "../rules/NodePatcherRule";
import createTemplate from "../template/createTemplate";
import setAttribute from "../dom/setAttribute";
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
export default class NodePatcher {
    templateString;
    template;
    rules;
    keyIndex;
    isSingleElement;
    constructor(strings) {
        const { templateString, template, keyIndex } = createTemplate(strings);
        this.templateString = templateString;
        this.template = template;
        const childNodes = template.content.childNodes;
        this.isSingleElement = childNodes.length === 1 &&
            childNodes[0].nodeType === Node.ELEMENT_NODE;
        this.rules = createNodePatcherRules(template.content);
        this.keyIndex = keyIndex;
    }
    firstPatch(rules, values = []) {
        const { length } = rules;
        for (let i = 0; i < length; ++i) {
            const value = values[i];
            const rule = rules[i];
            const node = rule.node;
            const attributeNames = node.getAttributeNames !== undefined ?
                node.getAttributeNames() :
                undefined;
            const attributesNotSet = new Set(attributeNames);
            switch (rule.type) {
                case NodePatcherRuleTypes.PATCH_CHILDREN:
                    {
                        const parentNode = node.parentNode;
                        if (Array.isArray(value)) {
                            mountNodesBefore(parentNode, node, value);
                        }
                        else if (!isUndefinedOrNull(value)) {
                            mountNodeBefore(parentNode, node, value);
                        }
                    }
                    break;
                case NodePatcherRuleTypes.PATCH_ATTRIBUTE:
                    {
                        const { name, property } = rule;
                        setAttribute(node, name, property, value);
                        attributesNotSet.delete(name);
                    }
                    break;
                case NodePatcherRuleTypes.PATCH_EVENT:
                    {
                        const { name } = rule;
                        setEvent(name, value, null, node);
                        attributesNotSet.delete(name);
                    }
                    break;
                default: throw new Error(`firstPatch is not implemented for rule type: ${rule.type}`);
            }
            attributesNotSet.forEach(a => {
                const value = node.getAttribute(a);
                if (value?.startsWith(attributeMarkerPrefix)) {
                    node.removeAttribute(a);
                }
            });
        }
    }
    patchNode(rules, oldValues = [], newValues = []) {
        const { length } = rules;
        for (let i = 0; i < length; ++i) {
            const oldValue = oldValues[i];
            const newValue = newValues[i];
            if (areEquivalent(oldValue, newValue)) {
                transferPatchingData(oldValue, newValue);
                continue;
            }
            const rule = rules[i];
            const { type, node } = rule;
            switch (type) {
                case NodePatcherRuleTypes.PATCH_CHILDREN:
                    {
                        if (Array.isArray(newValue)) {
                            if (Array.isArray(oldValue)) {
                                patchChildren(node, oldValue, newValue);
                            }
                            else {
                                if (!isUndefinedOrNull(oldValue)) {
                                    removeLeftSibling(node);
                                }
                                mountNodesBefore(node.parentNode, node, newValue);
                            }
                        }
                        else {
                            if (!isUndefinedOrNull(newValue)) {
                                if (isUndefinedOrNull(oldValue)) {
                                    mountNodeBefore(node.parentNode, node, newValue);
                                }
                                else {
                                    if (isNodePatchingData(oldValue) &&
                                        oldValue.patcher === newValue.patcher) {
                                        updateNode(node, oldValue, newValue);
                                    }
                                    else {
                                        if (Array.isArray(oldValue)) {
                                            removeLeftSiblings(node);
                                            mountNodeBefore(node.parentNode, node, newValue);
                                        }
                                        else {
                                            replaceChild(node, newValue, oldValue);
                                        }
                                    }
                                }
                            }
                            else {
                                if (!isUndefinedOrNull(oldValue)) {
                                    if (Array.isArray(oldValue) ||
                                        isNodePatchingData(oldValue)) {
                                        removeLeftSiblings(node);
                                    }
                                    else {
                                        removeLeftSibling(node);
                                    }
                                }
                            }
                        }
                    }
                    break;
                case NodePatcherRuleTypes.PATCH_ATTRIBUTE:
                    {
                        const { name, property } = rule;
                        setAttribute(node, name, property, newValue);
                    }
                    break;
                case NodePatcherRuleTypes.PATCH_EVENT:
                    {
                        const { name } = rule;
                        setEvent(name, newValue, oldValue, node);
                    }
                    break;
                default: throw new Error(`patch is not implemented for rule type: ${type}`);
            }
        }
    }
}
function patchChildren(markerNode, oldPatchingData = [], newPatchingData = []) {
    oldPatchingData = oldPatchingData || [];
    let { length: oldChildrenCount } = oldPatchingData;
    const keyedNodes = MapKeyedNodes(oldPatchingData);
    const { length: newChildrenCount } = newPatchingData;
    for (let i = 0; i < newChildrenCount; ++i) {
        const newChild = newPatchingData[i];
        const newChildKey = getKey(newChild);
        const oldChild = oldPatchingData[i];
        if (oldChild === undefined) {
            if (keyedNodes.has(newChildKey)) {
                const oldChild = keyedNodes.get(newChildKey);
                updateNode(oldChild?.node, oldChild, newChild);
            }
            else {
                mountNodeBefore(markerNode.parentNode, markerNode, newChild);
                ++oldChildrenCount;
            }
        }
        else {
            const oldChildKey = getKey(oldChild);
            if (newChildKey === oldChildKey) {
                if (isPrimitive(oldChild)) {
                    replaceChild(markerNode, newChild, oldChild);
                }
                else {
                    updateNode(oldChild?.node, oldChild, newChild);
                }
            }
            else {
                if (keyedNodes.has(newChildKey)) {
                    const oldKeyedChild = keyedNodes.get(newChildKey);
                    updateNode(oldKeyedChild.node, oldKeyedChild, newChild);
                    replaceChild(markerNode, oldKeyedChild, oldChild);
                }
                else {
                    const existingChild = markerNode.parentNode?.childNodes[i + 1];
                    mountNodeBefore(existingChild.parentNode, existingChild, newChild);
                    ++oldChildrenCount;
                }
            }
        }
    }
    for (let i = oldChildrenCount - 1; i >= newChildrenCount; --i) {
        removeLeftSibling(markerNode);
    }
}
function MapKeyedNodes(children) {
    const keyedNodes = new Map();
    children.forEach(child => {
        const key = getKey(child);
        if (key !== null) {
            keyedNodes.set(key, child);
        }
    });
    return keyedNodes;
}
function getKey(patchingData) {
    if (isPrimitive(patchingData)) {
        return null;
    }
    const { patcher, values } = patchingData;
    const { keyIndex } = patcher;
    return keyIndex !== undefined ?
        values[keyIndex] :
        null;
}
//# sourceMappingURL=NodePatcher.js.map