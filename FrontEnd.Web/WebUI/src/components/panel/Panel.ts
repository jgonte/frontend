import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import { RenderReturnTypes } from "../../custom-element/mixins/metadata/types/IRenderable";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import html from "../../rendering/html";
import { panelStyles } from "./Panel.styles";

/**
 * It is a component that has a header, body and footer
 */
export default class Panel extends CustomElement {

    static get styles(): string {

        return mergeStyles(super.styles, panelStyles);
    }

    render(): RenderReturnTypes {

        return html`
            <div id=header>
                <slot name="header"></slot>
            </div>
            <div id=body>
                <slot name="body"></slot>
            </div>
            <div id=footer>
                <slot name="footer"></slot>
            </div>
        `;
    }
}

defineCustomElement('gcs-panel', Panel);