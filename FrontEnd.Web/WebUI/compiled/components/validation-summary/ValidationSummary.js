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
        return html `
${this.renderWarnings()}
${this.renderErrors()}`;
    }
    renderWarnings() {
        const { warnings } = this;
        if (warnings === undefined) {
            return null;
        }
        return warnings.map((warning) => html `
<gcs-alert 
    kind="warning"
>
    <gcs-localized-text>${warning}</gcs-localized-text>   
</gcs-alert>`);
    }
    renderErrors() {
        const { errors } = this;
        if (errors === undefined) {
            return null;
        }
        return errors.map((error) => html `
<gcs-alert 
    kind="danger"
>
    <gcs-localized-text>${error}</gcs-localized-text>   
</gcs-alert>`);
    }
}
defineCustomElement('gcs-validation-summary', ValidationSummary);
//# sourceMappingURL=ValidationSummary.js.map