import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomElementStateMetadata from "../../custom-element/mixins/metadata/types/CustomElementStateMetadata";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../utils/data/DataTypes";
import { closingEvent } from "../tools/close/CloseTool";

export default class Dialog extends CustomElement {

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            content: {
                type: DataTypes.Function,
                defer: true,
                //required: true - it might not be provided while the dialog is not showing
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

        this.showing = false; // Hide the dialog
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

            return html`
<gcs-overlay>
    ${content()}
</gcs-overlay>`;
        }
        else {

            return html`
<gcs-overlay>
    <slot></slot>
</gcs-overlay>`;
        }
        
    }
}

defineCustomElement('gcs-dialog', Dialog);