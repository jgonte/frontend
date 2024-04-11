import { DataTypes } from "../../../utils/data/DataTypes";
import renderEmptyData from "./renderEmptyData";
export default function CollectionDataHolder(Base) {
    return class CollectionDataHolderMixin extends Base {
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
        render() {
            return this.renderData();
        }
        renderData() {
            const { data } = this;
            const d = typeof data === "function" ?
                data() :
                data;
            if (d.length === 0) {
                return renderEmptyData('body');
            }
            return d.map((record) => this._applyTemplate(record));
        }
    };
}
//# sourceMappingURL=CollectionDataHolder.js.map