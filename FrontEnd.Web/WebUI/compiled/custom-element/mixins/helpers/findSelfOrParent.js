export default function findSelfOrParent(element, predicate) {
    let parent = element;
    do {
        if (predicate(parent) === true) {
            return parent;
        }
        parent = parent.parentNode;
        if (parent instanceof DocumentFragment) {
            parent = parent.host;
        }
    } while (parent !== null);
    return null;
}
//# sourceMappingURL=findSelfOrParent.js.map