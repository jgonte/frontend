import { attributeMarkerPrefix, endMarker, eventMarkerPrefix } from "../template/markers";
import NodePatcherAttributeRule from "./NodePatcherAttributeRule";
import NodePatcherChildrenRule from "./NodePatcherChildrenRule";
import NodePatcherEventRule from "./NodePatcherEventRule";
import { NodePatcherRule } from "./NodePatcherRule";

/**
 * Creates the rules for the node patcher
 * @param node 
 * @param path 
 * @param rules 
 * @returns 
 */
export default function createNodePatcherRules(node: Node, path: number[] = [], rules: NodePatcherRule[] = []): NodePatcherRule[] {

    const {
        childNodes
    } = node;

    const {
        length
    } = childNodes;

    if ((node as Text).data === endMarker) {

        rules.push(
            new NodePatcherChildrenRule([...path])
        );

        return rules; // Comments do not have attributes and children so we are done
    }
    else if (node.nodeType === Node.TEXT_NODE) {

        return rules; // No need to create rules for a text literal
    }
    else {

        const attributes = (node as HTMLElement).attributes;

        if (attributes !== undefined) {

            rules = createAttributePatcherRules(attributes, path, rules);
        }
    }

    for (let i = 0; i < length; ++i) {

        rules = createNodePatcherRules(childNodes[i], [...path, i], rules);
    }

    return rules;
}

function createAttributePatcherRules(attributes: NamedNodeMap, path: number[], rules: NodePatcherRule[]): NodePatcherRule[] {

    const {
        length
    } = attributes;

    for (let i = 0; i < length; ++i) {

        const value = attributes[i].value;

        if (value.startsWith(attributeMarkerPrefix)) {

            const name = value.split(':')[1];

            rules.push(
                new NodePatcherAttributeRule(path, name)
            );
        }
        else if (value.startsWith(eventMarkerPrefix)) {

            const name = value.split(':')[1];

            rules.push(
                new NodePatcherEventRule(path, name)
            );
        }
    }

    return rules;
}