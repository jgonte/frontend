import defineCustomElement from "../../../custom-element/defineCustomElement";
import { DataTypes } from "../../../utils/data/DataTypes";
import Tool from "../Tool";
export const sorterChanged = 'sorterChanged';
export default class SorterTool extends Tool {
    static get properties() {
        return {
            column: {
                type: DataTypes.String,
                required: true
            }
        };
    }
    static get state() {
        return {
            ascending: {
                value: undefined
            }
        };
    }
    iconName = () => {
        const { ascending } = this;
        if (ascending === undefined) {
            return 'arrow-down-up';
        }
        return ascending === true ?
            'arrow-up' :
            'arrow-down';
    };
    handleClick() {
        this.ascending = !this.ascending;
        this.dispatchCustomEvent(sorterChanged, {
            column: this.column,
            ascending: this.ascending,
            element: this
        });
    }
}
defineCustomElement('gcs-sorter-tool', SorterTool);
//# sourceMappingURL=SorterTool.js.map