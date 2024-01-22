import { NodePatchingData } from "./NodePatchingData";
export declare function mountNode(p: Node, pd: NodePatchingData): void;
export declare function mountNodeBefore(p: Node, ch: Node, pd: NodePatchingData): void;
export declare function mountNodes(p: Node, pd: NodePatchingData[]): void;
export declare function mountNodesBefore(p: Node, ch: Node, pd: NodePatchingData[]): void;
