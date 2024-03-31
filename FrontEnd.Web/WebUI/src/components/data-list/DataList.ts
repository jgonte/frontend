import SelectionContainer from "../mixins/selection-container/SelectionContainer";
import RemoteLoadableHolder from "../mixins/remote-loadable/RemoteLoadable";
import CollectionDataHolder from "../mixins/data-holder/CollectionDataHolder";
import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import { GenericRecord } from "../../utils/types";
import { DataTypes } from "../../utils/data/DataTypes";
import { dataListStyles } from "./DataList.styles";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import { renderEmptyData } from "../mixins/data-holder/renderEmptyData";

/**
 * Render a collection of records
 */
export default class DataList extends
    SelectionContainer(
        RemoteLoadableHolder(
            CollectionDataHolder(
                CustomElement as CustomHTMLElementConstructor
            )
        )
    ) {

    static get styles(): string {

        return mergeStyles(super.styles, dataListStyles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The template to render the item
             */
            itemTemplate: {
                attribute: 'item-template',
                type: DataTypes.Function,
                required: true,
                defer: true // Store the function itself instead of executing it to get its return value when initializing the property
            }
        };
    }

    render(): NodePatchingData[] | NodePatchingData {

        const {
            idField,
            data
        } = this;

        if (data.length === 0) {

            return renderEmptyData();
        }

        return data.map((record: GenericRecord) =>
            this.itemTemplate(record, record[idField])
        );
    }
}

defineCustomElement('gcs-data-list', DataList);