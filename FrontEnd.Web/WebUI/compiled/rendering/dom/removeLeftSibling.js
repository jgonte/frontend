export default function removeLeftSibling(markerNode) {
    const { parentNode, previousSibling } = markerNode;
    parentNode?.removeChild(previousSibling);
}
//# sourceMappingURL=removeLeftSibling.js.map