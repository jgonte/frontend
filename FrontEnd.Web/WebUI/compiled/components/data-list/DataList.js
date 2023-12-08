import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import SelectionContainer from "../mixins/selection-container/SelectionContainer";
import DataCollectionHolder from "../mixins/data/DataCollectionHolder";
import { DataTypes } from "../../utils/data/DataTypes";
import { dataListStyles } from "./DataList.styles";
import mergeStyles from "../../custom-element/styles/mergeStyles";
export default class DataList extends SelectionContainer(DataCollectionHolder(CustomElement)) {
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
        const { idField } = this;
        return this.data.map((record) => {
            return this.itemTemplate(record, record[idField]);
        });
    }
}
defineCustomElement('gcs-data-list', DataList);
//# sourceMappingURL=DataList.js.map