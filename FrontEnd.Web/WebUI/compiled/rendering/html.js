import NodePatcher from "./patcher/NodePatcher";
const patchersCache = new Map();
export default function html(strings, ...values) {
    const key = strings.toString();
    let patcher = patchersCache.get(key);
    if (patcher === undefined) {
        patcher = new NodePatcher(strings);
        patchersCache.set(key, patcher);
    }
    return {
        patcher,
        rules: null,
        values
    };
}
//# sourceMappingURL=html.js.map