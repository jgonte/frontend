import CustomElement from "../../custom-element/CustomElement";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { GenericRecord } from "../../utils/types";
import ITreeNodeData from "./ITreeNodeData";
declare const TreeView_base: typeof CustomElement;
export default class TreeView extends TreeView_base {
    static get styles(): string;
    _applyTemplate(record: GenericRecord): NodePatchingData;
    _renderNode(nodeData: ITreeNodeData): NodePatchingData;
    _renderChildrenNodes(nodesData: ITreeNodeData[]): NodePatchingData[];
}
export {};
