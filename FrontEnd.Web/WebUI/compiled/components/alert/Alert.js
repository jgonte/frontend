import Closable from "../mixins/closable/Closable";
import Nuanced from "../Nuanced";
import defineCustomElement from "../../custom-element/defineCustomElement";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import html from "../../rendering/html";
import { alertStyles } from "./Alert.styles";
import { DataTypes } from "../../utils/data/DataTypes";
export default class Alert extends Closable(Nuanced) {
    static get styles() {
        return mergeStyles(super.styles, alertStyles);
    }
    static get properties() {
        return {
            showIcon: {
                attribute: 'show-icon',
                type: DataTypes.Boolean,
                value: true
            }
        };
    }
    render() {
        return html `
<gcs-row class="bordered">
    ${this._renderIcon()}
    <span slot="middle">
        <slot></slot>
    </span>
    ${this.renderCloseTool()}
</gcs-row>`;
    }
    _renderIcon() {
        const { showIcon, } = this;
        if (showIcon !== true) {
            return null;
        }
        return html `
<gcs-icon 
    slot="start" 
    name=${this._getIconName()}
>
</gcs-icon>`;
    }
    _getIconName() {
        switch (this.kind) {
            case "success": return "check-circle-fill";
            case "warning": return "exclamation-circle-fill";
            case "error": return "exclamation-circle-fill";
            default: return "info-circle-fill";
        }
    }
}
defineCustomElement('gcs-alert', Alert);
//# sourceMappingURL=Alert.js.map