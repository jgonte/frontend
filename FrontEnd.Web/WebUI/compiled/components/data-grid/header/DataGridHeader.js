import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import mergeStyles from "../../../custom-element/styles/mergeStyles";
import html from "../../../rendering/html";
import { DataTypes } from "../../../utils/data/DataTypes";
import { dataGridHeaderStyles } from "./DataGridHeader.styles";
export default class DataGridHeader extends CustomElement {
    static get styles() {
        return mergeStyles(super.styles, dataGridHeaderStyles);
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
        return this.columns.map((column) => {
            return html `<gcs-data-header-cell column=${column} key=${column.name || column}></gcs-data-header-cell>`;
        });
    }
}
defineCustomElement('gcs-data-header', DataGridHeader);
//# sourceMappingURL=DataGridHeader.js.map