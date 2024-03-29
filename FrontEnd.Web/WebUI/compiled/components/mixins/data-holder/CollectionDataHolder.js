import html from "../../../rendering/html";
import compareValues from "../../../rendering/utils/compareValues";
import { DataTypes } from "../../../utils/data/DataTypes";
import { sorterChanged } from "../../tools/sorter/SorterTool";
export default function CollectionDataHolder(Base) {
    return class CollectionDataHolderMixin extends Base {
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
        renderEmptyData(slot = null) {
            return html `
<gcs-alert 
    kind="warning"
    slot=${slot}
>
    <gcs-localized-text>No Records Found</gcs-localized-text>
</gcs-alert>`;
        }
        sort(event) {
            const { column, ascending, element } = event.detail;
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
                        return compareValues(r1[column], r2[column]);
                    }
                    else {
                        return compareValues(r2[column], r1[column]);
                    }
                };
                this.data = [...this.data].sort(comparer);
            }
        }
    };
}
//# sourceMappingURL=CollectionDataHolder.js.map