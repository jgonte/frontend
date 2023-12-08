import { CompiledNodePatcherRule } from "../rules/CompiledNodePatcherRule";
import { INodePatcher } from "../patcher/INodePatcher";
import { GenericRecord } from "../../utils/types";
export type NodePatchingDataValue = NodePatchingData | EventListenerOrEventListenerObject | string | number | boolean | object | null;
export type NodePatchingDataValues = NodePatchingDataValue[] | NodePatchingDataValue[][];
export interface NodePatchingDataHolder {
    _$patchingData: NodePatchingData | string;
}
export type PatchedNode = Node & NodePatchingDataHolder;
export type PatchedChildNode = ChildNode & NodePatchingDataHolder;
export type ExtensibleHTMLElement = HTMLElement & GenericRecord;
export type PatchedHTMLElement = ExtensibleHTMLElement & NodePatchingDataHolder;
export type AnyPatchedNode = PatchedNode | PatchedChildNode | PatchedHTMLElement;
export interface NodePatchingData {
    node?: AnyPatchedNode;
    patcher: INodePatcher;
    rules: CompiledNodePatcherRule[] | null;
    values: NodePatchingDataValues;
}
