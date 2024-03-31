import { NodePatchingData, NodePatchingDataValues } from "./nodes/NodePatchingData";
import NodePatcher from "./patcher/NodePatcher";

const patchersCache = new Map<string, NodePatcher>();

export default function html(strings: TemplateStringsArray, ...values: NodePatchingDataValues): NodePatchingData {

    const key = strings.toString();

    if (key.trim() == '') {

        throw new Error('Tempate string cannot be empty. Return null if you do not want to create HTML nodes');
    }

    let patcher = patchersCache.get(key);

    if (patcher === undefined) {

        patcher = new NodePatcher(strings);

        patchersCache.set(key, patcher);
    }

    // Return a new patching data with the shared patcher
    return {
        patcher,
        rules: null,
        values
    };
}