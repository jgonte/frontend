import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import popupManager from "../../custom-element/managers/popupManager";
import getClasses from "../../custom-element/styles/getClasses";
import html from "../../rendering/html";
import { expanderChangedEvent } from "../tools/expander/ExpanderTool";
import { selectionChangedEvent } from "../mixins/selectable/Selectable";
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
    connectedCallback() {
        super.connectedCallback?.();
        this.addEventListener(expanderChangedEvent, this.handleExpanderChanged);
        this.addEventListener(selectionChangedEvent, this.handleSelectionChanged);
    }
    disconnectedCallback() {
        super.disconnectedCallback?.();
        this.removeEventListener(expanderChangedEvent, this.handleExpanderChanged);
        this.removeEventListener(selectionChangedEvent, this.handleSelectionChanged);
    }
    render() {
        const { showing } = this;
        const contentClasses = getClasses({
            'dropdown-content': true,
            'show': showing
        });
        return html `
<slot id="header" name="header"></slot>
<gcs-expander-tool id="expander-tool"></gcs-expander-tool>
<slot id="content" class=${contentClasses} name="content"></slot>`;
    }
    handleExpanderChanged(evt) {
        evt.stopPropagation();
        const { showing } = evt.detail;
        if (showing === true) {
            popupManager.add(this);
        }
        this.showing = showing;
    }
    handleSelectionChanged(evt) {
        evt.stopPropagation();
        this.hideContent();
        this.showing = false;
    }
    hideContent() {
        const expanderTool = this.document.getElementById('expander-tool');
        expanderTool.hideContent();
        popupManager.remove(this);
    }
}
defineCustomElement('gcs-drop-down', DropDown);
//# sourceMappingURL=DropDown.js.map