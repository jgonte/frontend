import CustomElement from "../../custom-element/CustomElement";
import { IContentHidable } from "../../utils/types";
import defineCustomElement from "../../custom-element/defineCustomElement";
import popupManager from "../../custom-element/managers/popupManager";
import CustomElementStateMetadata from "../../custom-element/mixins/metadata/types/CustomElementStateMetadata";
import getClasses from "../../custom-element/styles/getClasses";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { expanderChangedEvent } from "../tools/expander/ExpanderTool";
import { selectionChangedEvent } from "../mixins/selectable/Selectable";
import { dropDownStyles } from "./DropDown.styles";
import ExpanderTool from "../tools/expander/ExpanderTool";

export default class DropDown 
    extends CustomElement
    implements IContentHidable {

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

    connectedCallback() {

        super.connectedCallback?.();

        this.addEventListener(expanderChangedEvent, this.handleExpanderChanged as EventListenerOrEventListenerObject);

        this.addEventListener(selectionChangedEvent, this.handleSelectionChanged as EventListenerOrEventListenerObject);
    }

    disconnectedCallback() {

        super.disconnectedCallback?.();

        this.removeEventListener(expanderChangedEvent, this.handleExpanderChanged as EventListenerOrEventListenerObject);

        this.removeEventListener(selectionChangedEvent, this.handleSelectionChanged as EventListenerOrEventListenerObject);
    }

    render(): NodePatchingData {

        const {
            showing
        } = this;

        const contentClasses = getClasses({
            'dropdown-content': true,
            'show': showing
        });

        return html`
<slot id="header" name="header"></slot>
<gcs-expander-tool id="expander-tool"></gcs-expander-tool>
<slot id="content" class=${contentClasses} name="content"></slot>`;
    }

    handleExpanderChanged(evt: CustomEvent) {

        evt.stopPropagation();

        const {
            showing
        } = evt.detail;

        if (showing === true) {

            popupManager.add(this as HTMLElement);
        }

        this.showing = showing;
    }

    /**
     * Hide the dropdown content once a selection is made
     * @param evt 
     */
    handleSelectionChanged(evt: CustomEvent) {

        evt.stopPropagation();

        this.hideContent();

        this.showing = false;
    }

    hideContent() {

        const expanderTool = (this.document as ShadowRoot).getElementById('expander-tool') as ExpanderTool;

        expanderTool.hideContent();

        // Remove the element from the manager regardless of whether a selection was made or not
        popupManager.remove(this as HTMLElement);
    }
}

defineCustomElement('gcs-drop-down', DropDown);