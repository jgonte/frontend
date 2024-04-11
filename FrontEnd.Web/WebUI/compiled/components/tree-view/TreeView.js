import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import html from "../../rendering/html";
import CollectionDataHolder from "../mixins/data-holder/CollectionDataHolder";
import { treeViewStyles } from "./TreeView.styles";
export default class TreeView extends CollectionDataHolder(CustomElement) {
    static get styles() {
        return mergeStyles(super.styles, treeViewStyles);
    }
    _applyTemplate(record) {
        return this._renderNode(record);
    }
    _renderNode(nodeData) {
        if (nodeData.nodes.length > 0) {
            return html `
<gcs-drop-down>
    <span slot="header">${nodeData.label}</span>
    <div slot="content">${this._renderChildrenNodes(nodeData.nodes)}</div>
</gcs-drop-down>`;
        }
        else {
            return html `<span>${nodeData.label}</span>`;
        }
    }
    _renderChildrenNodes(nodesData) {
        return nodesData.map((r) => this._renderNode(r));
    }
}
defineCustomElement('gcs-tree-view', TreeView);
//# sourceMappingURL=TreeView.js.map