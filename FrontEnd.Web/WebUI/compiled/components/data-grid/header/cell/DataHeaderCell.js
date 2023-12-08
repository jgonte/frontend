import CustomElement from "../../../../custom-element/CustomElement";
import defineCustomElement from "../../../../custom-element/defineCustomElement";
import getStyle from "../../../../custom-element/styles/getStyle";
import mergeStyles from "../../../../custom-element/styles/mergeStyles";
import html from "../../../../rendering/html";
import { DataTypes } from "../../../../utils/data/DataTypes";
import { dataHeaderCellStyles } from "./DataHeaderCell.styles";
export default class DataHeaderCell extends CustomElement {
    static get styles() {
        return mergeStyles(super.styles, dataHeaderCellStyles);
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
            }
        };
    }
    render() {
        const { column, } = this;
        if (typeof column === 'string') {
            return html `${column}`;
        }
        else {
            const { name, display } = column;
            if (display !== undefined) {
                if (typeof display === 'function') {
                    return this.renderCellContainer(column, display());
                }
                else {
                    return this.renderCellContainer(column, html `<span>${display}</span>`);
                }
            }
            else {
                return this.renderCellContainer(column, html `<span>${name}</span>`);
            }
        }
    }
    renderCellContainer(column, display) {
        const { headerStyle } = column;
        if (headerStyle !== undefined) {
            const style = typeof headerStyle === 'string' ?
                headerStyle :
                getStyle(headerStyle);
            return html `<span style=${style}>${display}${this.renderSorter()}</span>`;
        }
        else {
            return html `<span>${display}${this.renderSorter()}</span>`;
        }
    }
    renderSorter() {
        const { column } = this;
        if (column.sortable !== true) {
            return null;
        }
        return html `<gcs-sorter-tool column=${column.name}></gcs-sorter-tool>`;
    }
}
defineCustomElement('gcs-data-header-cell', DataHeaderCell);
//# sourceMappingURL=DataHeaderCell.js.map