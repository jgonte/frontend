import { CompiledNodePatcherRule } from "./CompiledNodePatcherRule";

/**
 * The types of patching supported by the rules
 */
export enum NodePatcherRuleTypes {

    PATCH_CHILDREN = "patch-children", // Patches either a single node or a collection of child nodes

    PATCH_ATTRIBUTE = 'patch-attribute',

    PATCH_EVENT = 'patch-event'
}

/**
 * Implemented by all the derived rules
 */
export interface NodePatcherRule {

    /**
     * The type of rule
     */
    type: NodePatcherRuleTypes;

    /**
     * The path to locate the node
     */
    path: number[];

    /**
     * Creates a compiled rule object from this rule
     */
    compile: (node: Node) => CompiledNodePatcherRule;
}