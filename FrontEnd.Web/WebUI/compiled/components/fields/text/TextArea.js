import defineCustomElement from "../../../custom-element/defineCustomElement";
import html from "../../../rendering/html";
import DisplayableField from "../DisplayableField";
export default class TextArea extends DisplayableField {
    render() {
        const { name, inputStyle, disabled } = this;
        return html `<textarea
            name=${name}
            style=${inputStyle}
            onInput=${event => this.handleInput(event)}
            onChange=${event => this.handleChange(event)}
            onBlur=${() => this.handleBlur()}
            disabled=${disabled}
        ></textarea>`;
    }
}
defineCustomElement('gcs-text-area', TextArea);
//# sourceMappingURL=TextArea.js.map