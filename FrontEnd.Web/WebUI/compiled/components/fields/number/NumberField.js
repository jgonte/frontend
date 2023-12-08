import defineCustomElement from "../../../custom-element/defineCustomElement";
import html from "../../../rendering/html";
import DisplayableField from "../DisplayableField";
export default class NumberField extends DisplayableField {
    render() {
        const { name, value, inputStyle, disabled } = this;
        return html `<input
            type="number"
            name=${name}
            value=${value}
            style=${inputStyle}
            onInput=${event => this.handleInput(event)}
            onChange=${event => this.handleChange(event)}
            onBlur=${() => this.handleBlur()}
            disabled=${disabled}
        />`;
    }
}
defineCustomElement('gcs-number-field', NumberField);
//# sourceMappingURL=NumberField.js.map