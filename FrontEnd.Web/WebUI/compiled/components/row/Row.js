import CustomElement from "../../custom-element/CustomElement";
import { rowStyles } from "./Row.styles";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import html from "../../rendering/html";
import defineCustomElement from "../../custom-element/defineCustomElement";
export default class Row extends CustomElement {
    static get styles() {
        return mergeStyles(super.styles, rowStyles);
    }
    render() {
        return html `
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
//# sourceMappingURL=Row.js.map