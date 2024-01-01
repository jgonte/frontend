import defineCustomElement from "../../../custom-element/defineCustomElement";
import html from "../../../rendering/html";
import Field from "../Field";
export default class HiddenField extends Field {
    render() {
        const { name, value, } = this;
        return html `
<input
    type="hidden"
    name=${name}
    value=${value}
/>`;
    }
}
defineCustomElement('gcs-hidden-field', HiddenField);
//# sourceMappingURL=HiddenField.js.map