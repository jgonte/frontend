import isPrimitive from "../../utils/isPrimitive";
import { CompiledNodePatcherRule } from "../rules/CompiledNodePatcherRule";
import { NodePatcherRule } from "../rules/NodePatcherRule";
import { NodePatchingData, PatchedChildNode, PatchedNode } from "./NodePatchingData";

/**
 * Creates the nodes to be appended to the parent one according to the patching data 
 * @param patchingData The patching data to create the nodes from
 * @returns The list of the created nodes
 */
export default function createNodes(patchingData: NodePatchingData | string): PatchedNode | Node | Text {

    if (isPrimitive(patchingData)) {

        return document.createTextNode(patchingData.toString());
    }

    const {
        patcher,
        values
    } = patchingData as NodePatchingData;

    const doc = patcher.template.content.cloneNode(/*deep*/true); // The content of the template is a document fragment

    const rules = compileRules(doc, patcher.rules);

    const {
        childNodes
    } = doc;

    // Set the first node as holder of the patching data
    const node = childNodes[0] as PatchedChildNode;

    (patchingData as NodePatchingData).node = node;

    // Attach the patching data to the node
    node._$patchingData = patchingData;

    // Update the rules of the patching data
    (patchingData as NodePatchingData).rules = rules;

    patcher.firstPatch(rules, values);

    return doc; // Return the DocumentFragment to its children can efficiently transferred to the container
}

/**
 * Creates a compiled rule by replacing the path with the reference to the node the rule acts upon
 * @param node The content node of the template
 * @param rules The rules to compile
 * @returns the compiled rules
 */
function compileRules(node: Node, rules: NodePatcherRule[]): CompiledNodePatcherRule[] {

    return rules.map(
        r => r.compile(findNode(node, r.path))
    );
}

/**
 * Finds the child node following the path
 * @param node The parent node
 * @param path The path to the child node
 * @returns The child node
 */
function findNode(node: Node, path: number[]): HTMLElement | Comment | Text {

    for (let i = 0; i < path.length; ++i) {

        node = node.childNodes[path[i]];
    }

    return node as HTMLElement | Comment | Text;
}
