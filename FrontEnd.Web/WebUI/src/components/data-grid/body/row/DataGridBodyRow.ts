import CustomElement from "../../../../custom-element/CustomElement";
import defineCustomElement from "../../../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import mergeStyles from "../../../../custom-element/styles/mergeStyles";
import html from "../../../../rendering/html";
import { NodePatchingData } from "../../../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../../../utils/data/DataTypes";
import Selectable from "../../../mixins/selectable/Selectable";
import IDataGridColumnDescriptor from "../../IDataGridColumnDescriptor";
import { dataGridBodyRowStyles } from "./DataGridBodyRow.styles";

export default class DataGridBodyRow
    extends Selectable(
        CustomElement as CustomHTMLElementConstructor
    ) {

    static get styles(): string {

        return mergeStyles(super.styles, dataGridBodyRowStyles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The descriptor of the columns to render the row
             */
            columns: {
                type: [
                    DataTypes.Array,
                    DataTypes.Function
                ],
                required: true
            },

            /**
             * The record to render the row from
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

    render(): NodePatchingData[] {

        const {
            record,
            columns
        } = this;

        return columns.map((column: string | number) =>
            html`
<gcs-data-cell 
    column=${column} 
    record=${record} 
    key=${(column as unknown as IDataGridColumnDescriptor).name || column}>
</gcs-data-cell>`
        );
    }
}

defineCustomElement('gcs-data-row', DataGridBodyRow);