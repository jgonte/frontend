import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../utils/data/DataTypes";

/**
 * Component that uses data and a template to generate its content
 */
 export default class DataTemplate extends CustomElement {

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The data used by the template to generate the markup
             */
            data: {
                type: [
                    DataTypes.Object, 
                    DataTypes.Function
                ],
                value: undefined
                //required: true - We might need to load it after connecting the component
            },

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

    constructor() {

        super();

        this.isSingleItemDataHolder = true;
    }

    render(): NodePatchingData {

        const {
            data,
            template
        } = this;

        return data === undefined ? 
            null :
            template(data);
    }
}

defineCustomElement('gcs-data-template', DataTemplate);