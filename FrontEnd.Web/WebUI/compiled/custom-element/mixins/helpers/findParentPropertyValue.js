import isUndefinedOrNull from "../../../utils/isUndefinedOrNull";
export default function findParentPropertyValue(element, name) {
    let parent = element;
    do {
        const value = parent[name];
        if (!isUndefinedOrNull(value)) {
            return value;
        }
        parent = parent.parentElement;
    } while (parent !== null);
    return null;
}
//# sourceMappingURL=findParentPropertyValue.js.map