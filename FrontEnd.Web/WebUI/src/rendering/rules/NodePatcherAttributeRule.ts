import { toCamelCase } from "../../utils/string";
import { CompiledNodePatcherRule } from "./CompiledNodePatcherRule";
import { NodePatcherRule, NodePatcherRuleTypes } from "./NodePatcherRule";

export interface CompiledNodePatcherAttributeRule extends Omit<NodePatcherAttributeRule, 'compile'>, CompiledNodePatcherRule { }

/**
 * Rule to patch the attribute of the node
 */
export default class NodePatcherAttributeRule implements NodePatcherRule {

    /**
     * The type of the patcher
     */
    type: NodePatcherRuleTypes = NodePatcherRuleTypes.PATCH_ATTRIBUTE;

    /**
     * The name of the property if the name of the attribute is dash-case
     */
    property: string;

    constructor(

        public path: number[],

        public name: string) {

        this.property = toCamelCase(this.name);
    }

    compile(node: Node): CompiledNodePatcherAttributeRule {

        return {
            type: this.type,
            path: this.path,
            name: this.name,
            property: this.property,
            node
        };
    }
}