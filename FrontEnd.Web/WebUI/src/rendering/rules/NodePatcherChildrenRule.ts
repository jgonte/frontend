import { CompiledNodePatcherRule } from "./CompiledNodePatcherRule";
import { NodePatcherRule, NodePatcherRuleTypes } from "./NodePatcherRule";

interface CompiledNodePatcherChildrenRule extends Omit<NodePatcherChildrenRule, 'compile'>, CompiledNodePatcherRule { }

/**
 * Rule to patch the children of the node
 */
export default class NodePatcherChildrenRule implements NodePatcherRule {
    
    type: NodePatcherRuleTypes = NodePatcherRuleTypes.PATCH_CHILDREN;

    constructor(public path: number[]) {}

    compile(node: Node): CompiledNodePatcherChildrenRule {

        return {
            type: this.type,
            path: this.path,
            node
        };
    }
}