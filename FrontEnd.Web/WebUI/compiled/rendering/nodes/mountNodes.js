import createNodes from "./createNodes";
export default function mountNodes(container, patchingData) {
    if (Array.isArray(patchingData)) {
        patchingData.forEach(pd => {
            container.appendChild(createNodes(pd));
        });
    }
    else {
        container.appendChild(createNodes(patchingData));
    }
}
//# sourceMappingURL=mountNodes.js.map