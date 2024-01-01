import defineCustomElement from "../../../custom-element/defineCustomElement";
import html from "../../../rendering/html";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import Field from "../Field";

export default class HiddenField extends Field {

    render(): NodePatchingData {

        const {
            name,
            value,
        } = this;

        return html`
<input
    type="hidden"
    name=${name}
    value=${value}
/>`;
    }
}

defineCustomElement('gcs-hidden-field', HiddenField);