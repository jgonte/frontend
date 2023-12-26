import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import mergeStyles from "../../../custom-element/styles/mergeStyles";
import html from "../../../rendering/html";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../../utils/data/DataTypes";
import DataGridColumnDescriptor from "../DataGridColumnDescriptor";
import { dataGridHeaderStyles } from "./DataGridHeader.styles";

export default class DataGridHeader extends CustomElement {

    static get styles(): string {

        return mergeStyles(super.styles, dataGridHeaderStyles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The descriptor of the columns to render the header
             */
            columns: {
                type: [
                    DataTypes.Array, 
                    DataTypes.Function
                ],
                required: true
            }
        };
    }

    render(): NodePatchingData[] {

        return this.columns.map((column: DataGridColumnDescriptor |string | number) => {

            return html`<gcs-data-header-cell column=${column} key=${(column as DataGridColumnDescriptor).name || column}></gcs-data-header-cell>`;
        });
    }
}

defineCustomElement('gcs-data-header', DataGridHeader);