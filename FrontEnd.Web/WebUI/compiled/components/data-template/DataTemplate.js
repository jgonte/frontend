import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import { DataTypes } from "../../utils/data/DataTypes";
import RemoteLoadableHolder from "../mixins/remote-loadable/RemoteLoadable";
export default class DataTemplate extends RemoteLoadableHolder(CustomElement) {
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
    render() {
        const { data, template } = this;
        return data === undefined ?
            null :
            template(data);
    }
}
defineCustomElement('gcs-data-template', DataTemplate);
//# sourceMappingURL=DataTemplate.js.map