import defineCustomElement from "../../../custom-element/defineCustomElement";
import html from "../../../rendering/html";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import DisplayableField from "../DisplayableField";

export default class TextField extends DisplayableField {

    render(): NodePatchingData {

        const {
            name,
            value,
            inputStyle,
            //required,
            disabled
        } = this;

        return html`<input
            type="text"
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

defineCustomElement('gcs-text-field', TextField);