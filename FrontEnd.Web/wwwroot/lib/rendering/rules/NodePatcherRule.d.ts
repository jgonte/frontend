import { CompiledNodePatcherRule } from "./CompiledNodePatcherRule";
export declare enum NodePatcherRuleTypes {
    PATCH_CHILDREN = "patch-children",
    PATCH_ATTRIBUTE = "patch-attribute",
    PATCH_EVENT = "patch-event"
}
export interface NodePatcherRule {
    type: NodePatcherRuleTypes;
    path: number[];
    compile: (node: Node) => CompiledNodePatcherRule;
}
