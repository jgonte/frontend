import Nuanced from "../Nuanced";
import defineCustomElement from "../../custom-element/defineCustomElement";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import html from "../../rendering/html";
import { alertStyles } from "./Alert.styles";
import { DataTypes } from "../../utils/data/DataTypes";
import { closingEvent } from "../tools/close/CloseTool";
export default class Alert extends Nuanced {
    static get styles() {
        return mergeStyles(super.styles, alertStyles);
    }
    static get properties() {
        return {
            showIcon: {
                type: DataTypes.Boolean,
                value: true
            },
            close: {
                type: [
                    DataTypes.Function,
                    DataTypes.Boolean
                ],
                defer: true
            }
        };
    }
    render() {
        return html `
${this._renderIcon()}
<div style="word-wrap: break-word; max-height: 80vh; overflow: auto;">
    <slot></slot>
</div>
${this._renderCloseTool()}`;
    }
    _renderIcon() {
        const { showIcon, } = this;
        if (showIcon !== true) {
            return html `<span></span>`;
        }
        return html `<gcs-icon name=${this._getIconName()}></gcs-icon>`;
    }
    _getIconName() {
        switch (this.kind) {
            case "success": return "check-circle-fill";
            case "warning": return "exclamation-circle-fill";
            case "error": return "exclamation-circle-fill";
            default: return "info-circle-fill";
        }
    }
    _renderCloseTool() {
        const { close } = this;
        if (close === undefined) {
            return html `<span></span>`;
        }
        const handleClose = close === true ?
            evt => this.dispatchCustomEvent(closingEvent, {
                originalEvent: evt
            }) :
            evt => this.close(evt);
        return html `<gcs-close-tool close=${handleClose}></gcs-close-tool>`;
    }
}
defineCustomElement('gcs-alert', Alert);
//# sourceMappingURL=Alert.js.map