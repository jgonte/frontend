import defineCustomElement from "../../custom-element/defineCustomElement";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import Disableable from "../mixins/disableable/Disableable";
import { buttonStyles } from "./Button.styles";
import { DataTypes } from "../../utils/data/DataTypes";
import Nuanced from "../Nuanced";
import Hideable from "../mixins/hideable/Hideable";

export default class Button extends
    Hideable(
        Disableable(
            Nuanced
        )
    ) {

    static get styles(): string {

        return mergeStyles(super.styles, buttonStyles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * Callback when the button is clicked
             */
            click: {
                type: DataTypes.Function,
                defer: true
            }
        };
    }

    render(): NodePatchingData | NodePatchingData[] | null {

        const {
            disabled,
            click
        } = this;

        return html`<button disabled=${disabled} onClick=${click}>
            <slot></slot>
        </button>`;
    }

}

defineCustomElement('gcs-button', Button);