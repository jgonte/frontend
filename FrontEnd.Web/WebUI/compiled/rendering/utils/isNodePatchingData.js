import isUndefinedOrNull from "../../utils/isUndefinedOrNull";
export default function isNodePatchingData(o) {
    if (isUndefinedOrNull(o)) {
        return false;
    }
    return o.patcher !== undefined;
}
//# sourceMappingURL=isNodePatchingData.js.map