import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import Selectable from "../mixins/selectable/Selectable";

/**
 * Wrapper to allow selection when clicked for the child element
 */
export default class Selector extends
    Selectable(
        CustomElement as CustomHTMLElementConstructor
    ) {

    // static get styles(): string {

    //     return styles as any;
    // }

}

defineCustomElement('gcs-selector', Selector);