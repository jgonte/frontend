import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import html from "../../rendering/html";
import { DataTypes } from "../../utils/data/DataTypes";
import Loadable from "../mixins/data/Loadable";
import Errorable from "../mixins/errorable/Errorable";
export default class Loader extends Loadable(Errorable(CustomElement)) {
    static get properties() {
        return {
            dataField: {
                attribute: 'data-field',
                type: DataTypes.String,
                value: 'data'
            }
        };
    }
    render() {
        return html `
<div style="position: relative;">
    ${this.renderLoading()}
    <slot id="data-holder"></slot>
</div>`;
    }
    handleLoadedData(data) {
        if (!this.dataHolder) {
            this.dataHolder = this.findChild((c) => c.isDataCollectionHolder || c.isNavigationContainer || c.isSingleItemDataHolder);
            this.dataHolder.loader = this;
        }
        this.dataHolder[this.dataField] = data.payload || data;
    }
}
defineCustomElement('gcs-loader', Loader);
//# sourceMappingURL=Loader.js.map