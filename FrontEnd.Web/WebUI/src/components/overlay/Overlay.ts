import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import { overlayStyles } from "./Overlay.styles";

export default class Overlay extends CustomElement {

    static get styles(): string {

        return overlayStyles;
    }
}

defineCustomElement('gcs-overlay', Overlay);