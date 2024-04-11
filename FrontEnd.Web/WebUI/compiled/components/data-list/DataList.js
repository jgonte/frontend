import SelectionContainer from "../mixins/selection-container/SelectionContainer";
import RemoteLoadableHolder from "../mixins/remote-loadable/RemoteLoadable";
import CollectionDataHolder from "../mixins/data-holder/CollectionDataHolder";
import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import { DataTypes } from "../../utils/data/DataTypes";
import { dataListStyles } from "./DataList.styles";
import mergeStyles from "../../custom-element/styles/mergeStyles";
export default class DataList extends SelectionContainer(RemoteLoadableHolder(CollectionDataHolder(CustomElement))) {
    static get styles() {
        return mergeStyles(super.styles, dataListStyles);
    }
    static get properties() {
        return {
            itemTemplate: {
                attribute: 'item-template',
                type: DataTypes.Function,
                required: true,
                defer: true
            }
        };
    }
    _applyTemplate(record) {
        return this.itemTemplate(record, record[this.idField]);
    }
}
defineCustomElement('gcs-data-list', DataList);
//# sourceMappingURL=DataList.js.map