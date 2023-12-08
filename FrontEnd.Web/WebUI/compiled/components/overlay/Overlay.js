import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import { overlayStyles } from "./Overlay.styles";
export default class Overlay extends CustomElement {
    static get styles() {
        return overlayStyles;
    }
}
defineCustomElement('gcs-overlay', Overlay);
//# sourceMappingURL=Overlay.js.map