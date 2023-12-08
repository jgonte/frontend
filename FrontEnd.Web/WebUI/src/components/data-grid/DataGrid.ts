import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../utils/data/DataTypes";
import { GenericRecord } from "../../utils/types";
import DataCollectionHolder from "../mixins/data/DataCollectionHolder";
import { dataGridStyles } from "./DataGrid.styles";
import mergeStyles from "../../custom-element/styles/mergeStyles";

export default class DataGrid extends
    DataCollectionHolder(
        CustomElement as CustomHTMLElementConstructor
    ) {

    static get styles(): string {

        return mergeStyles(super.styles, dataGridStyles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The descriptor of the columns to render each row
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

    render(): NodePatchingData {

        return html`
<gcs-panel>
    ${this.renderHeader()}
    ${this.renderBody()}      
</gcs-panel>`;
    }

    renderHeader(): NodePatchingData {

        return html`
<gcs-data-header
    slot="header"
    columns=${this.columns}>
</gcs-data-header>`;
    }

    renderBody(): NodePatchingData[] {

        const {
            columns,
            data,
            idField
        } = this;

        return data.map((record: GenericRecord) =>
            html`
<gcs-data-row 
    slot="body"
    columns=${columns}
    record=${record} 
    key=${record[idField]}>
</gcs-data-row>`
        );
    }
}

defineCustomElement('gcs-data-grid', DataGrid);