import Closable from "../../mixins/closable/Closable";
import CustomElement from "../../../custom-element/CustomElement";
import mergeStyles from "../../../custom-element/styles/mergeStyles";
import { panelHeaderStyles } from "./PanelHeader.style";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import html from "../../../rendering/html";
import { DataTypes } from "../../../utils/data/DataTypes";
export default class PanelHeader extends Closable(CustomElement) {
    static get styles() {
        return mergeStyles(super.styles, panelHeaderStyles);
    }
    static get properties() {
        return {
            iconName: {
                attribute: 'icon-name',
                type: [
                    DataTypes.String
                ]
            }
        };
    }
    render() {
        return html `
<span class="item">
    ${this.renderIcon()}
</span> 
<span class="item">
    <slot name="title"></slot>
</span>
<span class="item">
    <slot name="tools"></slot>
    ${this.renderCloseTool()}
</span>`;
    }
    renderIcon() {
        const { iconName } = this;
        if (iconName) {
            return html `
<gcs-icon 
    slot="start" 
    name=${this.iconName}
>
</gcs-icon>`;
        }
        else {
            return null;
        }
    }
}
defineCustomElement('gcs-panel-header', PanelHeader);
//# sourceMappingURL=PanelHeader.js.map