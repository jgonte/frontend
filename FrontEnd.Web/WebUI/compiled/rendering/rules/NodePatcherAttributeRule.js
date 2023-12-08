import { toCamelCase } from "../../utils/string";
import { NodePatcherRuleTypes } from "./NodePatcherRule";
export default class NodePatcherAttributeRule {
    path;
    name;
    type = NodePatcherRuleTypes.PATCH_ATTRIBUTE;
    property;
    constructor(path, name) {
        this.path = path;
        this.name = name;
        this.property = toCamelCase(this.name);
    }
    compile(node) {
        return {
            type: this.type,
            path: this.path,
            name: this.name,
            property: this.property,
            node
        };
    }
}
//# sourceMappingURL=NodePatcherAttributeRule.js.map