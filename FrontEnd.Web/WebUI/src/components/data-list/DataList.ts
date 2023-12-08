import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import SelectionContainer from "../mixins/selection-container/SelectionContainer";
import DataCollectionHolder from "../mixins/data/DataCollectionHolder";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import { GenericRecord } from "../../utils/types";
import { DataTypes } from "../../utils/data/DataTypes";
import { dataListStyles } from "./DataList.styles";
import mergeStyles from "../../custom-element/styles/mergeStyles";

/**
 * Render a collection of records
 */
export default class DataList extends
    SelectionContainer(
        DataCollectionHolder(
            CustomElement as CustomHTMLElementConstructor
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

    render(): NodePatchingData[] {

        const {
            idField
        } = this;

        return this.data.map((record: GenericRecord) => {

            return this.itemTemplate(record, record[idField]);
        });
    }
}

defineCustomElement('gcs-data-list', DataList);