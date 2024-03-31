import NodePatcher from "./patcher/NodePatcher";
const patchersCache = new Map();
export default function html(strings, ...values) {
    const key = strings.toString();
    if (key.trim() == '') {
        throw new Error('Tempate string cannot be empty. Return null if you do not want to create HTML nodes');
    }
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