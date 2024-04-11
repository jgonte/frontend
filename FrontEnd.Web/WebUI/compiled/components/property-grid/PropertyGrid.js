import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import html from "../../rendering/html";
import labelAlign from "../form/labelAlign";
import labelWidth from "../form/labelWidth";
import Configurable from "../mixins/configurable/Configurable";
import SingleRecordDataHolder from "../mixins/data-holder/SingleRecordDataHolder";
import { propertyGridStyles } from "./PropertyGrid.styles";
export default class PropertyGrid extends Configurable(SingleRecordDataHolder(CustomElement)) {
    static get styles() {
        return mergeStyles(super.styles, propertyGridStyles);
    }
    static get properties() {
        return {
            labelWidth,
            labelAlign
        };
    }
    render() {
        return html `
<gcs-panel>
    ${this._renderLabel()}
    ${this._renderIcon()}
    ${this.renderData()}
</gcs-panel>`;
    }
    configure(source) {
        this.source = source;
    }
    _renderLabel() {
        return html `
<gcs-localized-text 
    slot="header"
>
    ${this.source.label || "Properties Grid"}
</gcs-localized-text>`;
    }
    _renderIcon() {
        const { iconName, } = this.source;
        if (!iconName) {
            return null;
        }
        return html `
<gcs-icon 
    slot="header"
    name=${iconName}
>
</gcs-icon>`;
    }
    _applyTemplate(record) {
        const { source, labelWidth, labelAlign } = this;
        const children = typeof source.children === "function" ?
            source.children() :
            source.children;
        return children.map((c) => html `
<gcs-property-grid-row 
    slot="body"
    label-width=${labelWidth} 
    label-align=${labelAlign} 
    label=${c.label}
    name=${c.name}
    type=${c.type || "string"}
    value=${record[c.name]} 
    key=${c.name}>
</gcs-property-grid-row>`);
    }
}
defineCustomElement('gcs-property-grid', PropertyGrid);
//# sourceMappingURL=PropertyGrid.js.map