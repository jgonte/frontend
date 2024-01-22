import createNodes from "./createNodes";
import { NodePatchingData } from "./NodePatchingData";

/**
 * Mounts a single node from a single NodePatchingData
 * @param p Parent node
 * @param pd Patching data with information on how to create the node
 */
export function mountNode(p: Node, pd: NodePatchingData) {

    p.appendChild(createNodes(pd));
}

/**
 * Mounts a single node before the child one
 * @param p Parent node
 * @param ch Child node to insert before
 * @param pd Patching data with information on how to create the node
 */
export function mountNodeBefore(p: Node, ch: Node, pd: NodePatchingData) {

    p.insertBefore(createNodes(pd), ch);
}

/**
 * Mounts a collection of nodes
 * @param p Parent node
 * @param pd Array of patching data with information on how to create the nodes
 */
export function mountNodes(p: Node, pd: NodePatchingData[]) {

    const df = document.createDocumentFragment();

    pd.forEach(v => mountNode(df, v as NodePatchingData));

    p.appendChild(df);
}

/**
 * Mounts a collection of nodes
 * @param p Parent node
 * @param ch Child node to insert before
 * @param pd Array of patching data with information on how to create the nodes
 */
export function mountNodesBefore(p: Node, ch: Node, pd: NodePatchingData[]) {

    const df = document.createDocumentFragment();

    pd.forEach(v => mountNode(df, v as NodePatchingData));

    p.insertBefore(df, ch);
}