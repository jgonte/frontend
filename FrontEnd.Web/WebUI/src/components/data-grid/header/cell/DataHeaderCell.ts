import CustomElement from "../../../../custom-element/CustomElement";
import defineCustomElement from "../../../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import getStyle from "../../../../custom-element/styles/getStyle";
import mergeStyles from "../../../../custom-element/styles/mergeStyles";
import html from "../../../../rendering/html";
import { NodePatchingData } from "../../../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../../../utils/data/DataTypes";
import DataGridColumnDescriptor from "../../DataGridColumnDescriptor";
import { dataHeaderCellStyles } from "./DataHeaderCell.styles";

export default class DataHeaderCell extends CustomElement {

    static get styles(): string {

        return mergeStyles(super.styles, dataHeaderCellStyles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The descriptor of the column to render the header cell
             */
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

    render(): NodePatchingData {

        const {
            column,
        } = this;

        if (typeof column === 'string') {

            return html`${column}`;
        }
        else {

            const {
                name,
                display
            } = column as DataGridColumnDescriptor;

            if (display !== undefined) {

                if (typeof display === 'function') {

                    return this.renderCellContainer(column, display());
                }
                else {

                    return this.renderCellContainer(column, html`<span>${display}</span>`);
                }
            }
            else {

                return this.renderCellContainer(column, html`<span>${name}</span>`);
            }
        }
    }

    renderCellContainer(column: DataGridColumnDescriptor, display: NodePatchingData): NodePatchingData {

        const {
            headerStyle
        } = column;

        if (headerStyle !== undefined) {

            const style = typeof headerStyle === 'string' ?
                headerStyle :
                getStyle(headerStyle);

            return html`<span style=${style}>${display}${this.renderSorter()}</span>`;
        }
        else {

            return html`<span>${display}${this.renderSorter()}</span>`;
        }
    }

    renderSorter(): NodePatchingData | null {

        const {
            column
        } = this;

        if (column.sortable !== true) {

            return null;
        }

        return html`<gcs-sorter-tool column=${column.name}></gcs-sorter-tool>`;
    }
}

defineCustomElement('gcs-data-header-cell', DataHeaderCell);