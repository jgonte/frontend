import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomElementStateMetadata from "../../custom-element/mixins/metadata/types/CustomElementStateMetadata";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../utils/data/DataTypes";
import { closingEvent } from "../tools/close/CloseTool";
import { overlayStyles } from "./Overlay.styles";

export default class Overlay extends CustomElement {

    static get styles(): string {

        return overlayStyles;
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            content: {
                type: DataTypes.Function,
                defer: true,
                //required: true - it might not be provided while the overlay is not showing
            }
        };
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

        this.addEventListener(closingEvent, this.handleClose);
    }

    disconnectedCallback() {

        super.disconnectedCallback?.();

        this.removeEventListener(closingEvent, this.handleClose);
    }

    handleClose() {

        this.showing = false; // Hide the overlay
    }

    render(): NodePatchingData | null {

        const {
            showing,
            content
        } = this;

        if (showing !== true) {

            return null;
        }

        if (content) {

            return html`${content()}`;
        }
        else {

            return html`<slot></slot>`;
        }
        
    }
}

defineCustomElement('gcs-overlay', Overlay);