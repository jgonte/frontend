import defineCustomElement from "../../../custom-element/defineCustomElement";
import html from "../../../rendering/html";
import { DataTypes } from "../../../utils/data/DataTypes";
import DisplayableField from "../DisplayableField";
export default class CheckBox extends DisplayableField {
    static getFieldType() {
        return DataTypes.Boolean;
    }
    render() {
        const { name, value, disabled } = this;
        return html `
<input
    type="checkbox"
    name=${name}
    value=${value}
    onInput=${event => this.handleInput(event)}
    onChange=${event => this.handleChange(event)}
    onBlur=${() => this.handleBlur()}
    disabled=${disabled}
/>`;
    }
    onValueChanged(value, _oldValue) {
        if (value === true) {
            this.checked = true;
        }
        else {
            this.checked = false;
        }
    }
}
defineCustomElement('gcs-check-box', CheckBox);
//# sourceMappingURL=CheckBox.js.map