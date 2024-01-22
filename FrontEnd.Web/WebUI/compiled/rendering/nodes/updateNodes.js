import areEquivalent from "../../utils/areEquivalent";
import { assert } from "../../utils/assert";
import isPrimitive from "../../utils/isPrimitive";
import isUndefinedOrNull from "../../utils/isUndefinedOrNull";
import { beginMarker } from "../template/markers";
import addPatcherComparer from "../utils/addPatcherComparer";
import transferPatchingData from "../utils/transferPatchingData";
import createNodes from "./createNodes";
import { mountNode, mountNodes } from "./mountNodes";
addPatcherComparer();
export function updateNode(p, oldPd, newPd) {
    if (areEquivalent(oldPd, newPd)) {
        transferPatchingData(oldPd, newPd);
        return;
    }
    const node = oldPd.node;
    assert.isTrue(!isUndefinedOrNull(node), 'There must be an existing node');
    if (Array.isArray(newPd)) {
        node.remove();
        mountNodes(p, newPd);
    }
    else if (isUndefinedOrNull(newPd)) {
        node.remove();
    }
    else if (isPrimitive(newPd)) {
        node.textContent = newPd.toString();
    }
    else {
        const { patcher: oldPatcher, values: oldValues, rules } = oldPd;
        const { patcher, values } = newPd;
        if (oldPatcher === patcher) {
            newPd.rules = rules;
            newPd.node = node;
            if (areEquivalent(oldPd.values, newPd.values)) {
                transferPatchingData(oldPd.values, newPd.values);
                return;
            }
            oldPatcher.patchNode(rules || [], oldValues, values);
            node._$patchingData = newPd;
        }
        else {
            const newNode = createNodes(newPd);
            if (node.data === beginMarker) {
                node.nextSibling.remove();
            }
            p.replaceChild(newNode, node);
        }
    }
}
export function updateNodes(p, oldPd, newPd) {
    if (areEquivalent(oldPd, newPd)) {
        transferPatchingData(oldPd, newPd);
        return;
    }
    if (Array.isArray(newPd)) {
        updateArrayNodes(p, oldPd, newPd);
    }
    else if (isPrimitive(newPd)) {
        p.childNodes[p.childNodes.length - 1].textContent = newPd.toString();
    }
    else if (isUndefinedOrNull(newPd)) {
        removeAllNodes(p);
    }
    else {
        removeAllNodes(p);
        mountNode(p, newPd);
    }
}
function updateArrayNodes(p, oldPd, newPd) {
    let { length: oldCount } = oldPd;
    const keyedNodes = new Map();
    for (let i = 0; i < oldCount; ++i) {
        const oldChild = oldPd[i].node;
        const key = oldChild.getAttribute?.('key') || null;
        if (key !== null) {
            keyedNodes.set(key, oldChild);
        }
    }
    const { length: newCount } = newPd;
    for (let i = 0; i < newCount; ++i) {
        const oldChild = i < oldPd.length ?
            oldPd[i].node :
            undefined;
        if (oldChild === undefined) {
            mountNode(p, newPd[i]);
        }
        else {
            const newChildPd = newPd[i];
            const { patcher, values } = newChildPd;
            const { keyIndex } = patcher;
            const valueKey = keyIndex !== undefined ?
                values[keyIndex]?.toString() :
                null;
            const oldChildKey = oldChild.getAttribute?.('key') || null;
            if (oldChildKey === valueKey) {
                updateNode(oldChild, oldPd[i], newChildPd);
                if (i >= p.childNodes.length) {
                    p.appendChild(oldChild);
                }
            }
            else {
                if (keyedNodes.has(valueKey)) {
                    const keyedNode = keyedNodes.get(valueKey);
                    if (areEquivalent(newChildPd.values, keyedNode._$patchingData.values)) {
                        if (i >= p.childNodes.length) {
                            p.appendChild(keyedNode);
                        }
                        else {
                            p.childNodes[i].replaceWith(keyedNode);
                            --oldCount;
                        }
                        newChildPd.node = keyedNode;
                        const { rules, values } = keyedNode._$patchingData;
                        newChildPd.rules = rules;
                        newChildPd.values = values;
                    }
                }
                else {
                    updateNode(oldChild, oldPd[i], newChildPd);
                }
            }
        }
    }
    for (let i = oldCount - 1; i >= newCount; --i) {
        oldPd[i].node.remove();
    }
}
function removeAllNodes(p) {
    while (p.firstChild) {
        p.removeChild(p.firstChild);
    }
}
//# sourceMappingURL=updateNodes.js.map