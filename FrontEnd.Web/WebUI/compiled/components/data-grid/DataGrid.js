import CustomElement from "../../custom-element/CustomElement";
import RemoteLoadableHolder from "../mixins/remote-loadable/RemoteLoadable";
import CollectionDataHolder from "../mixins/data-holder/CollectionDataHolder";
import defineCustomElement from "../../custom-element/defineCustomElement";
import html from "../../rendering/html";
import { DataTypes } from "../../utils/data/DataTypes";
import { dataGridStyles } from "./DataGrid.styles";
import mergeStyles from "../../custom-element/styles/mergeStyles";
export default class DataGrid extends RemoteLoadableHolder(CollectionDataHolder(CustomElement)) {
    static get styles() {
        return mergeStyles(super.styles, dataGridStyles);
    }
    static get properties() {
        return {
            columns: {
                type: [
                    DataTypes.Array,
                    DataTypes.Function
                ],
                required: true
            }
        };
    }
    render() {
        return html `
<gcs-panel>
    ${this.renderHeader()}
    ${this.renderBody()}      
</gcs-panel>`;
    }
    renderHeader() {
        return html `
<gcs-data-header
    slot="header"
    columns=${this.columns}>
</gcs-data-header>`;
    }
    renderBody() {
        const { columns, data, idField } = this;
        if (data.length === 0) {
            return this.renderEmptyData('body');
        }
        return data.map((record) => html `
<gcs-data-row 
    slot="body"
    columns=${columns}
    record=${record} 
    key=${record[idField]}>
</gcs-data-row>`);
    }
    load() {
        if (this.loadUrl) {
            this.loadRemote('body');
        }
        else {
            throw new Error('load local is not implemented');
        }
    }
}
defineCustomElement('gcs-data-grid', DataGrid);
//# sourceMappingURL=DataGrid.js.map