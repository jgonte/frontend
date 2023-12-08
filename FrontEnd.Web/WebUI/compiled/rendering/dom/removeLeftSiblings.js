import { endMarker, beginMarker } from "../template/markers";
export default function removeLeftSiblings(markerNode) {
    const { parentNode } = markerNode;
    let sibling = markerNode.previousSibling;
    let endMarkersCount = 1;
    while (sibling !== null) {
        if (sibling.data === endMarker) {
            ++endMarkersCount;
        }
        if (sibling.data === beginMarker &&
            --endMarkersCount === 0) {
            break;
        }
        parentNode?.removeChild(sibling);
        sibling = markerNode.previousSibling;
    }
}
//# sourceMappingURL=removeLeftSiblings.js.map