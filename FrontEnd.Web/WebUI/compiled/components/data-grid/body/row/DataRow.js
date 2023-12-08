import CustomElement from "../../../../custom-element/CustomElement";
import defineCustomElement from "../../../../custom-element/defineCustomElement";
import mergeStyles from "../../../../custom-element/styles/mergeStyles";
import html from "../../../../rendering/html";
import { DataTypes } from "../../../../utils/data/DataTypes";
import Selectable from "../../../mixins/selectable/Selectable";
import { dataRowStyles } from "./DataRow.styles";
export default class DataRow extends Selectable(CustomElement) {
    static get styles() {
        return mergeStyles(super.styles, dataRowStyles);
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
defineCustomElement('gcs-data-row', DataRow);
//# sourceMappingURL=DataRow.js.map