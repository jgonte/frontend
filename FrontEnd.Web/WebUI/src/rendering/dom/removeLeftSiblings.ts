import { endMarker, beginMarker } from "../template/markers";

export default function removeLeftSiblings(markerNode: Node) {

    const {
        parentNode
    } = markerNode;

    let sibling = markerNode.previousSibling;

    // Keep the count of end markers to know how many beign markers to remove, which should correspond to the number of end markers found
    let endMarkersCount: number = 1; // The marker node should be the first end marker found

    while (sibling !== null) {

        if ((sibling as Comment).data === endMarker) {

            ++endMarkersCount;
        }

        if ((sibling as Comment).data === beginMarker &&
            --endMarkersCount === 0) { // Decrements the end marker 

            break; // Got the desired begin marker ... done
        }

        parentNode?.removeChild(sibling);

        sibling = markerNode.previousSibling;
    }
}