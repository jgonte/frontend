import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import zIndexManager from "../../custom-element/managers/zIndexManager";
import html from "../../rendering/html";
import { DataTypes } from "../../utils/data/DataTypes";
import isUndefinedOrNull from "../../utils/isUndefinedOrNull";
import { closingEvent } from "../tools/close/CloseTool";
import { overlayStyles } from "./Overlay.styles";
export default class Overlay extends CustomElement {
    static get styles() {
        return overlayStyles;
    }
    static get properties() {
        return {
            content: {
                type: DataTypes.Function,
                defer: true,
            }
        };
    }
    static get state() {
        return {
            showing: {
                value: false,
                afterChange: function (value, oldValue) {
                    if (isUndefinedOrNull(oldValue)) {
                        return;
                    }
                    if (value === true) {
                        zIndexManager.add(this);
                    }
                    else {
                        zIndexManager.remove(this);
                    }
                }
            }
        };
    }
    connectedCallback() {
        super.connectedCallback?.();
        this.addEventListener(closingEvent, this.handleClose);
    }
    disconnectedCallback() {
        super.disconnectedCallback?.();
        this.removeEventListener(closingEvent, this.handleClose);
    }
    handleClose() {
        this.showing = false;
    }
    render() {
        const { showing, content } = this;
        if (showing !== true) {
            return null;
        }
        if (content) {
            return html `${content()}`;
        }
        else {
            return html `<slot></slot>`;
        }
    }
}
defineCustomElement('gcs-overlay', Overlay);
//# sourceMappingURL=Overlay.js.map