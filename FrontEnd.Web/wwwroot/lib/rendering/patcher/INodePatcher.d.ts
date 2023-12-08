import { NodePatchingDataValues } from "../nodes/NodePatchingData";
import { CompiledNodePatcherRule } from "../rules/CompiledNodePatcherRule";
import { NodePatcherRule } from "../rules/NodePatcherRule";
export interface INodePatcher {
    template: HTMLTemplateElement;
    rules: NodePatcherRule[];
    keyIndex?: number;
    firstPatch(rules: CompiledNodePatcherRule[], values: NodePatchingDataValues): void;
    patchNode(rules: CompiledNodePatcherRule[], oldValues: NodePatchingDataValues, newValues: NodePatchingDataValues): void;
}
