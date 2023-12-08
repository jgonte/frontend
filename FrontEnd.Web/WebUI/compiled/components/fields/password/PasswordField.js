import defineCustomElement from "../../../custom-element/defineCustomElement";
import html from "../../../rendering/html";
import DisplayableField from "../DisplayableField";
export default class PasswordField extends DisplayableField {
    render() {
        const { name, value, inputStyle, disabled } = this;
        return html `<input
            type="password"
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
defineCustomElement('gcs-password-field', PasswordField);
//# sourceMappingURL=PasswordField.js.map