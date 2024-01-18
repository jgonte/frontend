import CustomElement from "../../../../custom-element/CustomElement";
import defineCustomElement from "../../../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import applyClasses from "../../../../custom-element/styles/applyClasses";
import mergeStyles from "../../../../custom-element/styles/mergeStyles";
import html from "../../../../rendering/html";
import { NodePatchingData } from "../../../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../../../utils/data/DataTypes";
import isUndefinedOrNull from "../../../../utils/isUndefinedOrNull";
import { dataGridBodyCellStyles } from "./DataGridBodyCell.styles";

export default class DataGridBodyCell extends CustomElement {

    static get styles(): string {

        return mergeStyles(super.styles, dataGridBodyCellStyles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The descriptor of the column to render the cell
             */
            column: {
                type: [
                    DataTypes.Object,
                    DataTypes.Function,
                    DataTypes.String
                ],
                required: true
            },
            
            /**
             * The record to render the cell from
             */
            record: {
                type: [
                    DataTypes.Object,
                    DataTypes.Function
                ],
                required: true
            }
        };
    }

    render(): NodePatchingData {

        const {
            column,
            record
        } = this;

        const name = typeof column === 'string' ?
            column :
            column.name;

        const value = record[name] || column.value;

        if (isUndefinedOrNull(value)) {

            throw new Error(`Undefined or null value in column: ${name}`);
        }

        applyClasses(this, {
            'data-cell': value !== '_$action' // Special value to set the column as an action one
        });

        if (column.render !== undefined) {

            return column.render(value, record, column);
        }
        else {

            return html`${value}`;
        }
    }
}

defineCustomElement('gcs-data-cell', DataGridBodyCell);