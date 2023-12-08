import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import { centerStyles } from "./Center.styles";
export default class Center extends CustomElement {
    static get styles() {
        return mergeStyles(super.styles, centerStyles);
    }
}
defineCustomElement('gcs-center', Center);
//# sourceMappingURL=Center.js.map