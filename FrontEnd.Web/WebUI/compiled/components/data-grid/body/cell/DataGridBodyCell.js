import CustomElement from "../../../../custom-element/CustomElement";
import defineCustomElement from "../../../../custom-element/defineCustomElement";
import mergeStyles from "../../../../custom-element/styles/mergeStyles";
import html from "../../../../rendering/html";
import { DataTypes } from "../../../../utils/data/DataTypes";
import isUndefinedOrNull from "../../../../utils/isUndefinedOrNull";
import { dataGridBodyCellStyles } from "./DataGridBodyCell.styles";
export default class DataGridBodyCell extends CustomElement {
    static get styles() {
        return mergeStyles(super.styles, dataGridBodyCellStyles);
    }
    static get properties() {
        return {
            column: {
                type: [
                    DataTypes.Object,
                    DataTypes.Function,
                    DataTypes.String
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
        const { column, record } = this;
        const name = typeof column === 'string' ?
            column :
            column.name;
        const value = record[name] || column.value;
        if (isUndefinedOrNull(value)) {
            throw new Error(`Undefined or null value in column: ${name}`);
        }
        if (column.render !== undefined) {
            return column.render(value, record, column);
        }
        else {
            return html `${value}`;
        }
    }
}
defineCustomElement('gcs-data-cell', DataGridBodyCell);
//# sourceMappingURL=DataGridBodyCell.js.map