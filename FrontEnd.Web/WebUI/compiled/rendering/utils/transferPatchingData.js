import isNodePatchingData from "./isNodePatchingData";
export default function transferPatchingData(oldPatchingData, newPatchingData) {
    if (Array.isArray(newPatchingData)) {
        for (let i = 0; i < newPatchingData.length; ++i) {
            transferData(oldPatchingData[i], newPatchingData[i]);
        }
    }
    else if (isNodePatchingData(newPatchingData)) {
        transferData(oldPatchingData, newPatchingData);
    }
    function transferData(oldPatchingData, newPatchingData) {
        if (!isNodePatchingData(oldPatchingData)) {
            return;
        }
        const { node, rules, values } = oldPatchingData;
        if (node === undefined) {
            throw new Error(`Node is required in node patching data: ${oldPatchingData.patcher.templateString}`);
        }
        newPatchingData.node = node;
        newPatchingData.rules = rules;
        newPatchingData.values = values;
    }
}
//# sourceMappingURL=transferPatchingData.js.map