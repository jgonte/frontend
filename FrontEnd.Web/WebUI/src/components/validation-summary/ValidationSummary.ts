import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../utils/data/DataTypes";

export default class ValidationSummary extends CustomElement {

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /** 
             * The warnings to display
             */
            warnings: {
                type: DataTypes.Array,
                value: []
            },

            /**
             * The errors to display
             */
            errors: {
                type: DataTypes.Array,
                value: []
            }
        };
    }

    render(): NodePatchingData {

        return html`
${this.renderWarnings()}
${this.renderErrors()}`;
    }

    renderWarnings() {

        const {
            warnings
        } = this;

        if (warnings === undefined) {

            return null;
        }

        return warnings.map((warning: string) => html`
<gcs-alert 
    kind="warning"
>
    <gcs-localized-text>${warning}</gcs-localized-text>   
</gcs-alert>`
        );
    }

    renderErrors() {

        const {
            errors
        } = this;

        if (errors === undefined) {

            return null;
        }

        return errors.map((error: string) => html`
<gcs-alert 
    kind="danger"
>
    <gcs-localized-text>${error}</gcs-localized-text>   
</gcs-alert>`);
    }
}

defineCustomElement('gcs-validation-summary', ValidationSummary);