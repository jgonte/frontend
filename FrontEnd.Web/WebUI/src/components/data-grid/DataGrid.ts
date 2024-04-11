import CustomElement from "../../custom-element/CustomElement";
import RemoteLoadableHolder from "../mixins/remote-loadable/RemoteLoadable";
import CollectionDataHolder from "../mixins/data-holder/CollectionDataHolder";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../utils/data/DataTypes";
import { GenericRecord } from "../../utils/types";
import { dataGridStyles } from "./DataGrid.styles";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import Sortable from "../mixins/sortable/Sortable";

export default class DataGrid extends
    Sortable(
        RemoteLoadableHolder(
            CollectionDataHolder(
                CustomElement as CustomHTMLElementConstructor
            )
        )
    )
{
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
    ${this.renderData()}      
</gcs-panel>`;
    }

    renderHeader(): NodePatchingData {

        return html`
<gcs-data-header
    slot="header"
    columns=${this.columns}>
</gcs-data-header>`;
    }

    _applyTemplate(record: GenericRecord): NodePatchingData {

        const {
            columns,
            idField
        } = this;

        return html`
<gcs-data-row 
    slot="body"
    columns=${columns}
    record=${record} 
    key=${record[idField]}>
</gcs-data-row>`;
    }

    load() {

        if (this.loadUrl) {

            this.loadRemote('body');
        }
        else {

            throw new Error('load local is not implemented');
        }
    }
}

defineCustomElement('gcs-data-grid', DataGrid);