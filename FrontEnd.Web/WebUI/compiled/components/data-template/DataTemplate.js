import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import { DataTypes } from "../../utils/data/DataTypes";
import SingleRecordDataHolder from "../mixins/data-holder/SingleRecordDataHolder";
import RemoteLoadableHolder from "../mixins/remote-loadable/RemoteLoadable";
export default class DataTemplate extends RemoteLoadableHolder(SingleRecordDataHolder(CustomElement)) {
    static get properties() {
        return {
            template: {
                type: DataTypes.Function,
                required: true,
                defer: true
            }
        };
    }
    _applyTemplate(record) {
        return this.template(record);
    }
}
defineCustomElement('gcs-data-template', DataTemplate);
//# sourceMappingURL=DataTemplate.js.map