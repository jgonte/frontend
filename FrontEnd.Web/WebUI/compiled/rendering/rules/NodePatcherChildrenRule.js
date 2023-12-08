import { NodePatcherRuleTypes } from "./NodePatcherRule";
export default class NodePatcherChildrenRule {
    path;
    type = NodePatcherRuleTypes.PATCH_CHILDREN;
    constructor(path) {
        this.path = path;
    }
    compile(node) {
        return {
            type: this.type,
            path: this.path,
            node
        };
    }
}
//# sourceMappingURL=NodePatcherChildrenRule.js.map