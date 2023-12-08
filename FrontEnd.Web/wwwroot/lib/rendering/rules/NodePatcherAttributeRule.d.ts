import { CompiledNodePatcherRule } from "./CompiledNodePatcherRule";
import { NodePatcherRule, NodePatcherRuleTypes } from "./NodePatcherRule";
export interface CompiledNodePatcherAttributeRule extends Omit<NodePatcherAttributeRule, 'compile'>, CompiledNodePatcherRule {
}
export default class NodePatcherAttributeRule implements NodePatcherRule {
    path: number[];
    name: string;
    type: NodePatcherRuleTypes;
    property: string;
    constructor(path: number[], name: string);
    compile(node: Node): CompiledNodePatcherAttributeRule;
}
