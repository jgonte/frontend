import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import popupManager from "../../custom-element/managers/popupManager";
import getClasses from "../../custom-element/styles/getClasses";
import html from "../../rendering/html";
import { expanderChanged } from "../tools/expander/ExpanderTool";
import { dropDownStyles } from "./DropDown.styles";
export default class DropDown extends CustomElement {
    static get styles() {
        return dropDownStyles;
    }
    static get state() {
        return {
            showing: {
                value: false
            }
        };
    }
    constructor() {
        super();
        this.handleDropChanged = this.handleDropChanged.bind(this);
    }
    render() {
        const { showing } = this;
        const contentClasses = getClasses({
            'dropdown-content': true,
            'show': showing
        });
        return html `<slot id="header" name="header"></slot>
            <gcs-expander-tool id="expander-tool"></gcs-expander-tool>
            <slot id="content" class=${contentClasses} name="content"></slot>`;
    }
    connectedCallback() {
        super.connectedCallback?.();
        this.addEventListener(expanderChanged, this.handleDropChanged);
    }
    disconnectedCallback() {
        super.disconnectedCallback?.();
        this.removeEventListener(expanderChanged, this.handleDropChanged);
    }
    handleDropChanged(evt) {
        evt.stopPropagation();
        const { showing } = evt.detail;
        if (showing === true) {
            popupManager.setShown(this);
        }
        this.showing = showing;
    }
    hideContent() {
        const expanderTool = this.document.getElementById('expander-tool');
        expanderTool.hideContent();
        popupManager.setHidden(this);
    }
}
defineCustomElement('gcs-drop-down', DropDown);
//# sourceMappingURL=DropDown.js.map