import { NodePatcherRuleTypes } from "./NodePatcherRule";

/**
 * Describes a compiled rule to patch a node
 * Compiling basically means finding the Node in the element that the rule acts upon
 */
export interface CompiledNodePatcherRule {

    /**
     * The type of rule to apply
     */
    type: NodePatcherRuleTypes;
    
    /**
     * The node the rule is acting upon
     */
    node: Node;
}