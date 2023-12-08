import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import html from "../../rendering/html";
import { DataTypes } from "../../utils/data/DataTypes";
export default class ValidationSummary extends CustomElement {
    static get properties() {
        return {
            warnings: {
                type: DataTypes.Array,
                value: []
            },
            errors: {
                type: DataTypes.Array,
                value: []
            }
        };
    }
    render() {
        return html `${this.renderWarnings()}
            ${this.renderErrors()}`;
    }
    renderWarnings() {
        const { warnings } = this;
        if (warnings === undefined) {
            return null;
        }
        return warnings.map((warning) => html `<gcs-alert kind="warning">${warning}</gcs-alert>`);
    }
    renderErrors() {
        const { errors } = this;
        if (errors === undefined) {
            return null;
        }
        return errors.map((error) => html `<gcs-alert kind="danger">${error}</gcs-alert>`);
    }
}
defineCustomElement('gcs-validation-summary', ValidationSummary);
//# sourceMappingURL=ValidationSummary.js.map