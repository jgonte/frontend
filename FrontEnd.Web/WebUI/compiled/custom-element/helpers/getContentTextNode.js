export default function getContentTextNode(element) {
    const textNodes = Array.from(element.childNodes)
        .filter(n => n.nodeType == element.TEXT_NODE);
    if (!textNodes) {
        return null;
    }
    return textNodes[0];
}
//# sourceMappingURL=getContentTextNode.js.map