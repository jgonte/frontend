import { NodePatcherRuleTypes } from "./NodePatcherRule";
export interface CompiledNodePatcherRule {
    type: NodePatcherRuleTypes;
    node: Node;
}
