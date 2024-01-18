import areEquivalent from "../../utils/areEquivalent";
import isPrimitive from "../../utils/isPrimitive";
import { beginMarker } from "../template/markers";
import addPatcherComparer from "../utils/addPatcherComparer";
import transferPatchingData from "../utils/transferPatchingData";
import createNodes from "./createNodes";
import mountNodes from "./mountNodes";
addPatcherComparer();
export default function updateNodes(container, oldPatchingData, newPatchingData) {
    if (areEquivalent(oldPatchingData, newPatchingData)) {
        transferPatchingData(oldPatchingData, newPatchingData);
        return;
    }
    if (Array.isArray(newPatchingData)) {
        if (Array.isArray(oldPatchingData)) {
            updateArrayNodes(container, oldPatchingData, newPatchingData);
        }
        else {
            oldPatchingData.node.remove();
            mountNodes(container, newPatchingData);
        }
    }
    else if (isPrimitive(newPatchingData)) {
        container.childNodes[container.childNodes.length - 1].textContent = newPatchingData.toString();
    }
    else {
        const { node } = oldPatchingData;
        if (node === undefined) {
            throw new Error('There must be an existing node');
        }
        const { patcher: oldPatcher, values: oldValues, rules } = oldPatchingData;
        const { patcher, values } = newPatchingData;
        if (oldPatcher === patcher) {
            newPatchingData.rules = rules;
            newPatchingData.node = node;
            if (areEquivalent(oldPatchingData.values, newPatchingData.values)) {
                transferPatchingData(oldPatchingData.values, newPatchingData.values);
                return;
            }
            oldPatcher.patchNode(rules || [], oldValues, values);
            node._$patchingData = newPatchingData;
        }
        else {
            const newNode = createNodes(newPatchingData);
            if (node.data === beginMarker) {
                node.nextSibling.remove();
            }
            container.replaceChild(newNode, node);
        }
    }
}
function updateArrayNodes(container, oldPatchingData, newPatchingData) {
    let { length: oldCount } = oldPatchingData;
    const keyedNodes = new Map();
    for (let i = 0; i < oldCount; ++i) {
        const { node: oldChild } = oldPatchingData[i];
        const key = oldChild.getAttribute?.('key') || null;
        if (key !== null) {
            keyedNodes.set(key, oldChild);
        }
    }
    const { length: newCount } = newPatchingData;
    for (let i = 0; i < newCount; ++i) {
        const oldChild = i < oldPatchingData.length ?
            oldPatchingData[i].node :
            undefined;
        if (oldChild === undefined) {
            mountNodes(container, newPatchingData[i]);
        }
        else {
            const newChildPatchingData = newPatchingData[i];
            const { patcher, values } = newChildPatchingData;
            const { keyIndex } = patcher;
            const valueKey = keyIndex !== undefined ?
                values[keyIndex]?.toString() :
                null;
            const oldChildKey = oldChild.getAttribute?.('key') || null;
            if (oldChildKey === valueKey) {
                updateNodes(oldChild, oldPatchingData[i], newChildPatchingData);
                if (i >= container.childNodes.length) {
                    container.appendChild(oldChild);
                }
            }
            else {
                if (keyedNodes.has(valueKey)) {
                    const keyedNode = keyedNodes.get(valueKey);
                    if (areEquivalent(newChildPatchingData.values, keyedNode._$patchingData.values)) {
                        if (i >= container.childNodes.length) {
                            container.appendChild(keyedNode);
                        }
                        else {
                            container.childNodes[i].replaceWith(keyedNode);
                            --oldCount;
                        }
                        newChildPatchingData.node = keyedNode;
                        const { rules, values } = keyedNode._$patchingData;
                        newChildPatchingData.rules = rules;
                        newChildPatchingData.values = values;
                    }
                }
                else {
                    updateNodes(oldChild, oldPatchingData[i], newChildPatchingData);
                }
            }
        }
    }
    for (let i = oldCount - 1; i >= newCount; --i) {
        oldPatchingData[i].node.remove();
    }
}
//# sourceMappingURL=updateNodes.js.map