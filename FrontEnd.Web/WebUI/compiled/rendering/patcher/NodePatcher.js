import isPrimitive from "../../utils/isPrimitive";
import isUndefinedOrNull from "../../utils/isUndefinedOrNull";
import createNodes from "../nodes/createNodes";
import mountNodes from "../nodes/mountNodes";
import createNodePatcherRules from "../rules/createNodePatcherRules";
import { NodePatcherRuleTypes } from "../rules/NodePatcherRule";
import createTemplate from "../template/createTemplate";
import setAttribute from "../dom/setAttribute";
import updateNodes from "../nodes/updateNodes";
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
            const { type, node } = rule;
            const attributeNames = node.getAttributeNames !== undefined ?
                node.getAttributeNames() :
                undefined;
            const attributesNotSet = new Set(attributeNames);
            switch (type) {
                case NodePatcherRuleTypes.PATCH_CHILDREN:
                    {
                        const { parentNode } = node;
                        if (Array.isArray(value)) {
                            const df = document.createDocumentFragment();
                            value.forEach(v => {
                                if (isPrimitive(v)) {
                                    const n = document.createTextNode(v.toString());
                                    parentNode.insertBefore(n, node);
                                }
                                else {
                                    mountNodes(df, v);
                                }
                            });
                            parentNode.insertBefore(df, node);
                        }
                        else if (!isUndefinedOrNull(value)) {
                            parentNode.insertBefore(createNodes(value), node);
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
                default: throw new Error(`firstPatch is not implemented for rule type: ${type}`);
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
                                newValue.forEach(pd => insertBefore(node, pd));
                            }
                        }
                        else {
                            if (!isUndefinedOrNull(newValue)) {
                                if (isUndefinedOrNull(oldValue)) {
                                    insertBefore(node, newValue);
                                }
                                else {
                                    if (isNodePatchingData(oldValue) &&
                                        oldValue.patcher === newValue.patcher) {
                                        updateNodes(node, oldValue, newValue);
                                    }
                                    else {
                                        if (Array.isArray(oldValue)) {
                                            removeLeftSiblings(node);
                                            insertBefore(node, newValue);
                                        }
                                        else {
                                            replaceChild(node, newValue, oldValue);
                                        }
                                    }
                                }
                            }
                            else {
                                if (oldValue !== undefined &&
                                    oldValue !== null) {
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
function patchChildren(markerNode, oldChildren = [], newChildren = []) {
    oldChildren = oldChildren || [];
    let { length: oldChildrenCount } = oldChildren;
    const keyedNodes = MapKeyedNodes(oldChildren);
    const { length: newChildrenCount } = newChildren;
    for (let i = 0; i < newChildrenCount; ++i) {
        const newChild = newChildren[i];
        const newChildKey = getKey(newChild);
        const oldChild = oldChildren[i];
        if (oldChild === undefined) {
            if (keyedNodes.has(newChildKey)) {
                const oldChild = keyedNodes.get(newChildKey);
                updateNodes(oldChild?.node, oldChild, newChild);
            }
            else {
                insertBefore(markerNode, newChild);
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
                    updateNodes(oldChild?.node, oldChild, newChild);
                }
            }
            else {
                if (keyedNodes.has(newChildKey)) {
                    const oldKeyedChild = keyedNodes.get(newChildKey);
                    updateNodes(oldKeyedChild.node, oldKeyedChild, newChild);
                    replaceChild(markerNode, oldKeyedChild, oldChild);
                }
                else {
                    const existingChild = markerNode.parentNode?.childNodes[i + 1];
                    insertBefore(existingChild, newChild);
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
function insertBefore(markerNode, newChild) {
    markerNode.parentNode.insertBefore(createNodes(newChild), markerNode);
}
//# sourceMappingURL=NodePatcher.js.map