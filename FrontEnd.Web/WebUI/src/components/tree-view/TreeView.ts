import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { GenericRecord } from "../../utils/types";
import CollectionDataHolder from "../mixins/data-holder/CollectionDataHolder";
import ITreeNodeData from "./ITreeNodeData";
import { treeViewStyles } from "./TreeView.styles";

export default class TreeView
    extends CollectionDataHolder(
        CustomElement
    ) {

    static get styles(): string {

        return mergeStyles(super.styles, treeViewStyles);
    }

    _applyTemplate(record: GenericRecord) : NodePatchingData {

        return this._renderNode(record as unknown as ITreeNodeData);
    }

    _renderNode(nodeData: ITreeNodeData): NodePatchingData {

        if (nodeData.nodes.length > 0) { // Has children

            return html`
<gcs-drop-down>
    <span slot="header">${nodeData.label}</span>
    <div slot="content">${this._renderChildrenNodes(nodeData.nodes)}</div>
</gcs-drop-down>`;
        }
        else {

            return html`<span>${nodeData.label}</span>`;
        }
    }

    _renderChildrenNodes(nodesData: ITreeNodeData[]) {

        return nodesData.map((r: ITreeNodeData) => this._renderNode(r));
    }
}

defineCustomElement('gcs-tree-view', TreeView);