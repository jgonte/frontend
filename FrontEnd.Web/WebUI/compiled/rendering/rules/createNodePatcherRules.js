import { attributeMarkerPrefix, endMarker, eventMarkerPrefix } from "../template/markers";
import NodePatcherAttributeRule from "./NodePatcherAttributeRule";
import NodePatcherChildrenRule from "./NodePatcherChildrenRule";
import NodePatcherEventRule from "./NodePatcherEventRule";
export default function createNodePatcherRules(node, path = [], rules = []) {
    const { childNodes } = node;
    const { length } = childNodes;
    if (node.data === endMarker) {
        rules.push(new NodePatcherChildrenRule([...path]));
        return rules;
    }
    else if (node.nodeType === Node.TEXT_NODE) {
        return rules;
    }
    else {
        const attributes = node.attributes;
        if (attributes !== undefined) {
            rules = createAttributePatcherRules(attributes, path, rules);
        }
    }
    for (let i = 0; i < length; ++i) {
        rules = createNodePatcherRules(childNodes[i], [...path, i], rules);
    }
    return rules;
}
function createAttributePatcherRules(attributes, path, rules) {
    const { length } = attributes;
    for (let i = 0; i < length; ++i) {
        const value = attributes[i].value;
        if (value.startsWith(attributeMarkerPrefix)) {
            const name = value.split(':')[1];
            rules.push(new NodePatcherAttributeRule(path, name));
        }
        else if (value.startsWith(eventMarkerPrefix)) {
            const name = value.split(':')[1];
            rules.push(new NodePatcherEventRule(path, name));
        }
    }
    return rules;
}
//# sourceMappingURL=createNodePatcherRules.js.map