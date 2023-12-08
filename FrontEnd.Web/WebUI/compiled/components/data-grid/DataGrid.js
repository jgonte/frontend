import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import html from "../../rendering/html";
import { DataTypes } from "../../utils/data/DataTypes";
import DataCollectionHolder from "../mixins/data/DataCollectionHolder";
import { dataGridStyles } from "./DataGrid.styles";
import mergeStyles from "../../custom-element/styles/mergeStyles";
export default class DataGrid extends DataCollectionHolder(CustomElement) {
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
        return data.map((record) => html `
<gcs-data-row 
    slot="body"
    columns=${columns}
    record=${record} 
    key=${record[idField]}>
</gcs-data-row>`);
    }
}
defineCustomElement('gcs-data-grid', DataGrid);
//# sourceMappingURL=DataGrid.js.map