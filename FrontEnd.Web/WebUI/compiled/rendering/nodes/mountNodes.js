import createNodes from "./createNodes";
export function mountNode(p, pd) {
    p.appendChild(createNodes(pd));
}
export function mountNodeBefore(p, ch, pd) {
    p.insertBefore(createNodes(pd), ch);
}
export function mountNodes(p, pd) {
    const df = document.createDocumentFragment();
    pd.forEach(v => mountNode(df, v));
    p.appendChild(df);
}
export function mountNodesBefore(p, ch, pd) {
    const df = document.createDocumentFragment();
    pd.forEach(v => mountNode(df, v));
    p.insertBefore(df, ch);
}
//# sourceMappingURL=mountNodes.js.map