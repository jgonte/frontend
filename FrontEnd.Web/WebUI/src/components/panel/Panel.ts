import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import { RenderReturnTypes } from "../../custom-element/mixins/metadata/types/IRenderable";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import Sizable from "../mixins/sizable/Sizable";
import { panelStyles } from "./Panel.styles";

/**
 * It is a component that has a header, body and footer
 */
export default class Panel extends
    Sizable(
        CustomElement as CustomHTMLElementConstructor
    ) {

    static get styles(): string {

        return mergeStyles(super.styles, panelStyles);
    }

    render(): RenderReturnTypes {

        return html`
            <div id=header>${this.renderHeader()}</div>
            <div id=body>${this.renderBody()}</div>
            <div id=footer>${this.renderFooter()}</div>
        `;
    }

    renderHeader(): NodePatchingData {

        return html`<slot name="header"></slot>`;
    }

    renderBody(): NodePatchingData {

        return html`<slot name="body"></slot>`;
    }

    renderFooter(): NodePatchingData {

        return html`<slot name="footer"></slot>`;
    }
}

defineCustomElement('gcs-panel', Panel);