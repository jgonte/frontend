import { NodePatchingDataValues } from "../nodes/NodePatchingData";
import { CompiledNodePatcherRule } from "../rules/CompiledNodePatcherRule";
import { NodePatcherRule } from "../rules/NodePatcherRule";

/**
 * The interface that describes the functionality of a node patcher
 */
export interface INodePatcher {

    /**
     * The template to clone and generate the node from
     */
    template: HTMLTemplateElement;

    /**
     * The rules to be cloned (compiled)to execute the patching
     */
    rules: NodePatcherRule[];

    /**
     * The index of the dynamic property where the key is
     */
    keyIndex?: number;

    /**
     * The first patch to create the node
       * @param rules 
     * @param values 
     */
    firstPatch(rules: CompiledNodePatcherRule[], values: NodePatchingDataValues): void;

    /**
     * The patch to update the node
     * @param rules 
     * @param oldValues 
     * @param newValues 
     * @param compareValues 
     */
    patchNode(rules: CompiledNodePatcherRule[], oldValues: NodePatchingDataValues, newValues: NodePatchingDataValues): void
}