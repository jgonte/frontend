import SelectionContainer from "../mixins/selection-container/SelectionContainer";
import RemoteLoadableHolder from "../mixins/remote-loadable/RemoteLoadable";
import CollectionDataHolder from "../mixins/data-holder/CollectionDataHolder";
import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import { DataTypes } from "../../utils/data/DataTypes";
import { dataListStyles } from "./DataList.styles";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import { renderEmptyData } from "../mixins/data-holder/renderEmptyData";
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
    render() {
        const { idField, data } = this;
        if (data.length === 0) {
            return renderEmptyData();
        }
        return data.map((record) => this.itemTemplate(record, record[idField]));
    }
}
defineCustomElement('gcs-data-list', DataList);
//# sourceMappingURL=DataList.js.map