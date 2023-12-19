import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata"
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor"
import compareValues from "../../../rendering/utils/compareValues"
import { DataTypes } from "../../../utils/data/DataTypes"
import { GenericRecord } from "../../../utils/types"
import SorterTool, { sorterChanged } from "../../tools/sorter/SorterTool"

export default function CollectionDataHolder<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class CollectionDataHolderMixin extends Base {

        _lastSorter?: SorterTool;

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

        connectedCallback() {

            super.connectedCallback?.();

            this.addEventListener(sorterChanged, this.sort as EventListenerOrEventListenerObject);
        }

        disconnectedCallback() {

            super.disconnectedCallback?.();

            this.removeEventListener(sorterChanged, this.sort as EventListenerOrEventListenerObject);
        }

        /**
         * Sorts the data
         */
        sort(event: CustomEvent): void {

            const {
                column,
                ascending,
                element // Send this element to track the current sorter
            } = event.detail;

            if (this._lastSorter !== element) {

                if (this._lastSorter !== undefined) {

                    this._lastSorter.ascending = undefined;
                }

                this._lastSorter = element;
            }

            if (this.loader !== undefined) { // Sort in the server

                throw new Error('Not implemented');
            }
            else { // Sort locally

                const comparer = (r1: GenericRecord, r2: GenericRecord) => {

                    if (ascending === true) {

                        return compareValues(r1[column], r2[column]);
                    }
                    else {

                        return compareValues(r2[column], r1[column]);
                    }
                }

                this.data = [...this.data].sort(comparer); // Clone the array so they are different
            }
        }
    }
}