import CustomElement from "../../custom-element/CustomElement";
import { rowStyles } from "./Row.styles";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import html from "../../rendering/html";
import defineCustomElement from "../../custom-element/defineCustomElement";

/**
 * A line component with three regions to layout the children
 */
export default class Row extends CustomElement {

    static get styles(): string {

        return mergeStyles(super.styles, rowStyles);
    }

    render(): NodePatchingData {

        return html`
<span class="item">
    <slot name="start"></slot>
</span>
<span class="item middle">
    <slot name="middle"></slot>
</span>
<span class="item">
    <slot name="end"></slot>
</span>`;
    }
}

defineCustomElement('gcs-row', Row);