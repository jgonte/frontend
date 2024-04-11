import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata"
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor"
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData"
import { DataTypes } from "../../../utils/data/DataTypes"
import { GenericRecord } from "../../../utils/types"
import renderEmptyData from "./renderEmptyData"

export default function CollectionDataHolder<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class CollectionDataHolderMixin extends Base {

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                /**
                 * The collection of records to render
                 */
                data: {
                    type: [
                        DataTypes.Array,
                        DataTypes.Function
                    ],
                    value: [],
                    //required: true - We might need to load it after connecting the component
                }
            }
        }

        render(): NodePatchingData[] | NodePatchingData {

            return this.renderData();
        }

        renderData(): NodePatchingData[] | NodePatchingData {

            const {
                data
            } = this;

            const d = typeof data === "function" ?
                data() :
                data;

            if (d.length === 0) {

                return renderEmptyData('body');
            }

            return d.map((record: GenericRecord) => this._applyTemplate(record));
        }

        // Abstract
        //_applyTemplate(record: GenericRecord) : NodePatchingData

    }
}