import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import { DataTypes } from "../../utils/data/DataTypes";
export default class DataTemplate extends CustomElement {
    static get properties() {
        return {
            data: {
                type: [
                    DataTypes.Object,
                    DataTypes.Function
                ],
                value: undefined
            },
            template: {
                type: DataTypes.Function,
                required: true,
                defer: true
            }
        };
    }
    constructor() {
        super();
        this.isSingleItemDataHolder = true;
    }
    render() {
        const { data, template } = this;
        return data === undefined ?
            null :
            template(data);
    }
}
defineCustomElement('gcs-data-template', DataTemplate);
//# sourceMappingURL=DataTemplate.js.map