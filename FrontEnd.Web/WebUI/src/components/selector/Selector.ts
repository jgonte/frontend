import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import Selectable from "../mixins/selectable/Selectable";

export default class Selector extends
    Selectable(
        CustomElement as CustomHTMLElementConstructor
    ) {
}

defineCustomElement('gcs-selector', Selector);