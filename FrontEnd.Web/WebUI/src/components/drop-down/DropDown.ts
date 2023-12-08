import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import popupManager from "../../custom-element/managers/popupManager";
import CustomElementStateMetadata from "../../custom-element/mixins/metadata/types/CustomElementStateMetadata";
import getClasses from "../../custom-element/styles/getClasses";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { expanderChanged } from "../tools/expander/ExpanderTool";
import { dropDownStyles } from "./DropDown.styles";
import ExpanderTool from "../tools/expander/ExpanderTool";

export default class DropDown extends CustomElement {

    static get styles(): string {

        return dropDownStyles;
    }

    static get state(): Record<string, CustomElementStateMetadata> {

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

    render(): NodePatchingData {

        const {
            showing
        } = this;

        const contentClasses = getClasses({
            'dropdown-content': true,
            'show': showing
        });

        return html`<slot id="header" name="header"></slot>
            <gcs-expander-tool id="expander-tool"></gcs-expander-tool>
            <slot id="content" class=${contentClasses} name="content"></slot>`;
    }

    connectedCallback() {

        super.connectedCallback?.();

        this.addEventListener(expanderChanged, this.handleDropChanged as EventListenerOrEventListenerObject);
    }

    disconnectedCallback() {

        super.disconnectedCallback?.();

        this.removeEventListener(expanderChanged, this.handleDropChanged as EventListenerOrEventListenerObject);
    }

    handleDropChanged(evt: CustomEvent) {

        evt.stopPropagation();

        const {
            showing
        } = evt.detail;

        if (showing === true) { // Hide the contents of other showing dropdowns and set this one as being shown

            popupManager.setShown(this as HTMLElement);
        }

        this.showing = showing;
    }

    hideContent() {

        const expanderTool = (this.document as ShadowRoot).getElementById('expander-tool') as ExpanderTool;

        expanderTool.hideContent();

        popupManager.setHidden(this as HTMLElement);
    }
}

defineCustomElement('gcs-drop-down', DropDown);