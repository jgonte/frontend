import { NodePatchingData } from "../nodes/NodePatchingData";
import NodePatcher from "../patcher/NodePatcher";
import isNodePatchingData from "./isNodePatchingData";

function transferData(oldPatchingData: NodePatchingData, newPatchingData: NodePatchingData) : void{

    if (!isNodePatchingData(oldPatchingData)) {

        return;
    }

    const {
        node, 
        rules, 
        values
    } = oldPatchingData as NodePatchingData;

    if (node === undefined) {

        throw new Error(`Node is required in node patching data: ${((oldPatchingData as NodePatchingData).patcher as NodePatcher).templateString}`);
    }

    newPatchingData.node = node;

    newPatchingData.rules = rules;

    newPatchingData.values = values; // Even if the values are equivalent, we need to transfer the old ones since they have the nodes attached
}

/**
 * Transfers the patching node data except the patcher
 * @param oldPatchingData 
 * @param newPatchingData 
 */
export default function transferPatchingData(oldPatchingData: NodePatchingData | NodePatchingData[], newPatchingData: NodePatchingData | NodePatchingData[]) {

    if (Array.isArray(newPatchingData)) {

        for (let i = 0; i < newPatchingData.length; ++i) {

            transferData((oldPatchingData as NodePatchingData[])[i], newPatchingData[i]);
        }
    }
    else if (isNodePatchingData(newPatchingData)) {

        transferData(oldPatchingData as NodePatchingData, newPatchingData);
    }
}