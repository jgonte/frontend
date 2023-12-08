import { CompiledNodePatcherRule } from "./CompiledNodePatcherRule";
import { NodePatcherRule, NodePatcherRuleTypes } from "./NodePatcherRule";

export interface CompiledNodePatcherEventRule extends Omit<NodePatcherEventRule, 'compile'>, CompiledNodePatcherRule { }

/**
 * Rule to patch the event of the node
 */
export default class NodePatcherEventRule implements NodePatcherRule {
    
    /**
     * The type of the patcher
     */
    type: NodePatcherRuleTypes = NodePatcherRuleTypes.PATCH_EVENT;

    constructor(public path: number[], public name: string) {
    }

    compile(node: Node): CompiledNodePatcherEventRule {

        return {
            type: this.type,
            path: this.path,
            name: this.name,
            node
        };
    }
}