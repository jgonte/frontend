import Closable from "../../mixins/closable/Closable";
import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import html from "../../../rendering/html";
import { DataTypes } from "../../../utils/data/DataTypes";
export default class PanelHeader extends Closable(CustomElement) {
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
<gcs-row>
    ${this.renderIcon()}
    <span slot="middle">
        <slot name="title"></slot>
    </span>
    <span slot="end">
        <slot name="tools"></slot>
    </span>
    ${this.renderCloseTool()}
</gcs-row>`;
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