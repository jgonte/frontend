import { DataTypes } from "../../../utils/data/DataTypes";
import renderEmptyData from "./renderEmptyData";
export default function SingleRecordDataHolder(Base) {
    return class SingleRecordDataHolderMixin extends Base {
        static get properties() {
            return {
                data: {
                    type: [
                        DataTypes.Object,
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
            if (!d) {
                return renderEmptyData('body');
            }
            return this._applyTemplate(d);
        }
    };
}
//# sourceMappingURL=SingleRecordDataHolder.js.map