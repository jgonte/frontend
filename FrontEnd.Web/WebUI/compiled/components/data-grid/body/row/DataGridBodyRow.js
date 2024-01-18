import CustomElement from "../../../../custom-element/CustomElement";
import defineCustomElement from "../../../../custom-element/defineCustomElement";
import mergeStyles from "../../../../custom-element/styles/mergeStyles";
import html from "../../../../rendering/html";
import { DataTypes } from "../../../../utils/data/DataTypes";
import Selectable from "../../../mixins/selectable/Selectable";
import { dataGridBodyRowStyles } from "./DataGridBodyRow.styles";
export default class DataGridBodyRow extends Selectable(CustomElement) {
    static get styles() {
        return mergeStyles(super.styles, dataGridBodyRowStyles);
    }
    static get properties() {
        return {
            columns: {
                type: [
                    DataTypes.Array,
                    DataTypes.Function
                ],
                required: true
            },
            record: {
                type: [
                    DataTypes.Object,
                    DataTypes.Function
                ],
                required: true
            }
        };
    }
    render() {
        const { record, columns } = this;
        return columns.map((column) => html `
<gcs-data-cell 
    column=${column} 
    record=${record} 
    key=${column.name || column}>
</gcs-data-cell>`);
    }
}
defineCustomElement('gcs-data-row', DataGridBodyRow);
//# sourceMappingURL=DataGridBodyRow.js.map