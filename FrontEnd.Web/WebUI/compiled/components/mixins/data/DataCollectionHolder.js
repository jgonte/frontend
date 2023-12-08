import compareValues from "../../../rendering/utils/compareValues";
import { DataTypes } from "../../../utils/data/DataTypes";
import { sorterChanged } from "../../tools/sorter/SorterTool";
export default function DataCollectionHolder(Base) {
    return class DataCollectionHolderMixin extends Base {
        _lastSorter;
        static get properties() {
            return {
                data: {
                    type: [
                        DataTypes.Array,
                        DataTypes.Function
                    ],
                    value: [],
                }
            };
        }
        connectedCallback() {
            super.connectedCallback?.();
            this.addEventListener(sorterChanged, this.sort);
        }
        disconnectedCallback() {
            super.disconnectedCallback?.();
            this.removeEventListener(sorterChanged, this.sort);
        }
        sort(event) {
            const { field, ascending, element } = event.detail;
            if (this._lastSorter !== element) {
                if (this._lastSorter !== undefined) {
                    this._lastSorter.ascending = undefined;
                }
                this._lastSorter = element;
            }
            if (this.loader !== undefined) {
                throw new Error('Not implemented');
            }
            else {
                const comparer = (r1, r2) => {
                    if (ascending === true) {
                        return compareValues(r1[field], r2[field]);
                    }
                    else {
                        return compareValues(r2[field], r1[field]);
                    }
                };
                this.data = [...this.data].sort(comparer);
            }
        }
    };
}
//# sourceMappingURL=DataCollectionHolder.js.map