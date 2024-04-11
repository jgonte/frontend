import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { toolbarStyles } from "./Toolbar.styles";

/**
 * General purpose tool bar
 */
export default class ToolBar extends CustomElement {

    static get styles(): string {

        return mergeStyles(super.styles, toolbarStyles);
    }

    render(): NodePatchingData {

        return html`
<span class="item">
    <slot name="icon"></slot>
</span> 
<span class="item">
    <slot name="title"></slot>
</span>
<span class="item">
    <slot name="tools"></slot>
</span>`;
    }
}

defineCustomElement('gcs-toolbar', ToolBar);