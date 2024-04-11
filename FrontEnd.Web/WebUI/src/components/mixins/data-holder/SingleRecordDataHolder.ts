import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata"
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor"
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData"
import { DataTypes } from "../../../utils/data/DataTypes"
import renderEmptyData from "./renderEmptyData"

export default function SingleRecordDataHolder<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class SingleRecordDataHolderMixin extends Base {

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                /**
                 * The single record to render
                 */
                data: {
                    type: [
                        DataTypes.Object,
                        DataTypes.Function
                    ],
                    value: [],
                    //required: true - We might need to load it after connecting the component
                }
            }
        }

        render(): NodePatchingData {

            return this.renderData();
        }

        renderData(): NodePatchingData {

            const {
                data
            } = this;

            const d = typeof data === "function" ?
                data() :
                data;

            if (!d) {

                return renderEmptyData('body');
            }

            return this._applyTemplate(d);
        }

        // Abstract
        //_applyTemplate(record: GenericRecord) : NodePatchingData

    }
}