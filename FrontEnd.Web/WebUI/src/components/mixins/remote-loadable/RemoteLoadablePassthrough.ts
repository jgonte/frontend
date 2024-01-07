import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import { DataTypes } from "../../../utils/data/DataTypes";

export default function RemoteLoadableHolderPassthrough<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class RemoteLoadableHolderPassthorughMixin extends Base {

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                /**
                 * The URL to retrieve the data from
                 */
                loadUrl: {
                    attribute: 'load-url',
                    type: DataTypes.String,
                    //required: true Loading the form or other component might be optional
                },

                /**
                 * Whether to load the data for the component when the component is connected
                 */
                autoLoad: {
                    attribute: 'auto-load',
                    type: DataTypes.Boolean,
                    value: true
                },

                /**
                 * The metadata key to get the metadata from the header of the response
                 */
                metadataKey: {
                    attribute: 'metadata-key',
                    type: DataTypes.String
                }
            };
        }
    }
}