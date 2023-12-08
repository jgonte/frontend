import { CompiledNodePatcherRule } from "./CompiledNodePatcherRule";
import { NodePatcherRule, NodePatcherRuleTypes } from "./NodePatcherRule";
interface CompiledNodePatcherChildrenRule extends Omit<NodePatcherChildrenRule, 'compile'>, CompiledNodePatcherRule {
}
export default class NodePatcherChildrenRule implements NodePatcherRule {
    path: number[];
    type: NodePatcherRuleTypes;
    constructor(path: number[]);
    compile(node: Node): CompiledNodePatcherChildrenRule;
}
export {};
