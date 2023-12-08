import { INodePatcher } from "./INodePatcher";
import { NodePatchingDataValues } from "../nodes/NodePatchingData";
import { CompiledNodePatcherRule } from "../rules/CompiledNodePatcherRule";
import { NodePatcherRule } from "../rules/NodePatcherRule";
export default class NodePatcher implements INodePatcher {
    templateString: string;
    template: HTMLTemplateElement;
    rules: NodePatcherRule[];
    keyIndex?: number;
    isSingleElement: boolean;
    constructor(strings: TemplateStringsArray);
    firstPatch(rules: CompiledNodePatcherRule[], values?: NodePatchingDataValues): void;
    patchNode(rules: CompiledNodePatcherRule[], oldValues?: NodePatchingDataValues, newValues?: NodePatchingDataValues): void;
}
