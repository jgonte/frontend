import CustomElement from "../../../../custom-element/CustomElement";
import defineCustomElement from "../../../../custom-element/defineCustomElement";
import mergeStyles from "../../../../custom-element/styles/mergeStyles";
import html from "../../../../rendering/html";
import { DataTypes } from "../../../../utils/data/DataTypes";
import isUndefinedOrNull from "../../../../utils/isUndefinedOrNull";
import { dataCellStyles } from "./DataCell.styles";
export default class DataCell extends CustomElement {
    static get styles() {
        return mergeStyles(super.styles, dataCellStyles);
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
        const value = record[name];
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
defineCustomElement('gcs-data-cell', DataCell);
//# sourceMappingURL=DataCell.js.map