import { CompiledNodePatcherRule } from "./CompiledNodePatcherRule";
import { NodePatcherRule, NodePatcherRuleTypes } from "./NodePatcherRule";
export interface CompiledNodePatcherEventRule extends Omit<NodePatcherEventRule, 'compile'>, CompiledNodePatcherRule {
}
export default class NodePatcherEventRule implements NodePatcherRule {
    path: number[];
    name: string;
    type: NodePatcherRuleTypes;
    constructor(path: number[], name: string);
    compile(node: Node): CompiledNodePatcherEventRule;
}
