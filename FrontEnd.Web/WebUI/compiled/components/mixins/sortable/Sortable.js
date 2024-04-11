import compareValues from "../../../rendering/utils/compareValues";
import { sorterChanged } from "../../tools/sorter/SorterTool";
export default function Sortable(Base) {
    return class SortableMixin extends Base {
        _lastSorter;
        connectedCallback() {
            super.connectedCallback?.();
            this.addEventListener(sorterChanged, this.sort);
        }
        disconnectedCallback() {
            super.disconnectedCallback?.();
            this.removeEventListener(sorterChanged, this.sort);
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
//# sourceMappingURL=Sortable.js.map