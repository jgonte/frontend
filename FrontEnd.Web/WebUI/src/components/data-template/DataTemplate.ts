import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../utils/data/DataTypes";
import { GenericRecord } from "../../utils/types";
import SingleRecordDataHolder from "../mixins/data-holder/SingleRecordDataHolder";
import RemoteLoadableHolder from "../mixins/remote-loadable/RemoteLoadable";

/**
 * Component that uses data and a template to generate its content
 */
export default class DataTemplate extends
    RemoteLoadableHolder(
        SingleRecordDataHolder(
            CustomElement
        )
    ) {

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The template to render the markup
             */
            template: {
                type: DataTypes.Function,
                required: true,
                defer: true // Store the function itself instead of executing it to get its return value when initializing the property
            }
        }
    }

    _applyTemplate(record: GenericRecord) : NodePatchingData {
        
        return this.template(record);
    }
}

defineCustomElement('gcs-data-template', DataTemplate);