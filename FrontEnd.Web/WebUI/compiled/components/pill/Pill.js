import defineCustomElement from "../../custom-element/defineCustomElement";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import html from "../../rendering/html";
import { pillStyles } from "./Pill.styles";
import Nuanced from "../Nuanced";
export default class Pill extends Nuanced {
    static get styles() {
        return mergeStyles(super.styles, pillStyles);
    }
    render() {
        return html `<slot></slot>`;
    }
}
defineCustomElement('gcs-pill', Pill);
//# sourceMappingURL=Pill.js.map