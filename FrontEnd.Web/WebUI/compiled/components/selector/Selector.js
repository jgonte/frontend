import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import Selectable from "../mixins/selectable/Selectable";
export default class Selector extends Selectable(CustomElement) {
}
defineCustomElement('gcs-selector', Selector);
//# sourceMappingURL=Selector.js.map