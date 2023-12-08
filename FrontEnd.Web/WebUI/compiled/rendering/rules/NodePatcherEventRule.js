import { NodePatcherRuleTypes } from "./NodePatcherRule";
export default class NodePatcherEventRule {
    path;
    name;
    type = NodePatcherRuleTypes.PATCH_EVENT;
    constructor(path, name) {
        this.path = path;
        this.name = name;
    }
    compile(node) {
        return {
            type: this.type,
            path: this.path,
            name: this.name,
            node
        };
    }
}
//# sourceMappingURL=NodePatcherEventRule.js.map