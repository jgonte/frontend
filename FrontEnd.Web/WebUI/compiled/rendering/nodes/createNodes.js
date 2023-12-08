import isPrimitive from "../../utils/isPrimitive";
export default function createNodes(patchingData) {
    if (isPrimitive(patchingData)) {
        return document.createTextNode(patchingData.toString());
    }
    const { patcher, values } = patchingData;
    const doc = patcher.template.content.cloneNode(true);
    const rules = compileRules(doc, patcher.rules);
    const { childNodes } = doc;
    const node = childNodes[0];
    patchingData.node = node;
    node._$patchingData = patchingData;
    patchingData.rules = rules;
    patcher.firstPatch(rules, values);
    return doc;
}
function compileRules(node, rules) {
    return rules.map(r => r.compile(findNode(node, r.path)));
}
function findNode(node, path) {
    for (let i = 0; i < path.length; ++i) {
        node = node.childNodes[path[i]];
    }
    return node;
}
//# sourceMappingURL=createNodes.js.map