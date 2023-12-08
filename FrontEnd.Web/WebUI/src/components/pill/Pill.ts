import defineCustomElement from "../../custom-element/defineCustomElement";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { pillStyles } from "./Pill.styles";
import Nuanced from "../Nuanced";

export default class Pill extends Nuanced {

    static get styles(): string {

        return mergeStyles(super.styles, pillStyles);
    }

    render(): NodePatchingData {

        return html`<slot></slot>`;
    }
}

defineCustomElement('gcs-pill', Pill);