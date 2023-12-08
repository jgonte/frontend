import areEquivalent from "../../utils/areEquivalent";
import isPrimitive from "../../utils/isPrimitive";
import createNodes from "../nodes/createNodes";
import { endMarker } from "../template/markers";
import addPatcherComparer from "../utils/addPatcherComparer";
import isNodePatchingData from "../utils/isNodePatchingData";
addPatcherComparer();
export default function replaceChild(markerNode, newChild, oldChild) {
    if (isPrimitive(newChild) &&
        isPrimitive(oldChild)) {
        const oldChildNode = findPreviousSibling(markerNode, node => node instanceof Text &&
            node.textContent === oldChild.toString());
        if (oldChildNode !== null) {
            oldChildNode.textContent = newChild.toString();
        }
    }
    else if (isNodePatchingData(oldChild)) {
        let oldChildNode = null;
        findPreviousSibling(markerNode, node => testThisOrAnyParent(node, (n) => {
            if (n._$patchingData === undefined) {
                return false;
            }
            const { patcher, values } = n._$patchingData;
            const { patcher: otherPatcher, values: otherValues } = oldChild;
            const r = patcher === otherPatcher &&
                areEquivalent(values, otherValues);
            if (r === true) {
                oldChildNode = n;
            }
            return r;
        }));
        if (oldChildNode === null) {
            throw new Error('oldChildNode cannot be null');
        }
        const { patcher: oldPatcher, rules, values: oldValues } = oldChildNode._$patchingData;
        const { patcher, values } = newChild;
        if (patcher === oldPatcher) {
            oldPatcher.patchNode(rules || [], oldValues, values);
            newChild.node = oldChild.node;
            oldChildNode._$patchingData.values = values;
        }
        else {
            const { parentNode } = oldChildNode;
            const newChildNode = createNodes(newChild);
            parentNode.replaceChild(newChildNode, oldChildNode);
        }
    }
    else {
        throw new Error('Not implemented');
    }
}
function findPreviousSibling(markerNode, predicate) {
    let { previousSibling } = markerNode;
    while (previousSibling !== null &&
        previousSibling.textContent !== endMarker) {
        if (predicate(previousSibling) === true) {
            return previousSibling;
        }
        previousSibling = previousSibling.previousSibling;
    }
    return null;
}
function testThisOrAnyParent(node, predicate) {
    let parentNode = node;
    while (parentNode !== null) {
        if (predicate(parentNode) === true) {
            return true;
        }
        parentNode = parentNode.parentNode;
    }
    return false;
}
//# sourceMappingURL=replaceChild.js.map