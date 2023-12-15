import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomElementStateMetadata from "../../../custom-element/mixins/metadata/types/CustomElementStateMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import html from "../../../rendering/html";
import { DataTypes } from "../../../utils/data/DataTypes";
import { ErrorResponse } from "../../../utils/data/transfer/ErrorResponse";
import Fetcher, { ContentTypeApplicationJson } from "../../../utils/data/transfer/Fetcher";
import { GenericRecord } from "../../../utils/types";

export default function Submittable<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class SubmittableMixin extends Base {

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                /**
                 * The URL to post the data to
                 */
                submitUrl: {
                    attribute: 'submit-url',
                    type: DataTypes.String,
                    required: true
                },

                method: {
                    type: [
                        DataTypes.String,
                        DataTypes.Function
                    ],
                    options: ['post', 'put']
                }
            };
        }

        static get state(): Record<string, CustomElementStateMetadata> {

            return {

                submitting: {
                    value: false
                }
            };
        }

        renderSubmitting() {

            const {
                submitting
            } = this;

            if (submitting === false) {

                return null;
            }

            return html`<gcs-overlay>
                <gcs-alert kind="info" >...Submitting</gcs-alert>
            </gcs-overlay>`;
        }

        connectedCallback() {

            super.connectedCallback?.();

            this._submitFetcher = new Fetcher({
                onData: async data => await this.handleSubmitData(data as unknown as GenericRecord),
                onError: error => this.handleSubmitError(error)
            });
        }

        submit() {

            this.error = undefined; // Clear any previous error

            this.submitting = true;

            const data = this.getSubmitData(); // Overriden by the derived classes

            this._submitFetcher.fetch({
                url: this.submitUrl,
                method: this.getMethod(data),
                contentType: this.getContentType(),
                data
            });
        }

        getContentType(): string {

            //TODO: return multipart/form-data if there is any attachment field in the form
            return ContentTypeApplicationJson;
        }

        getMethod(data: GenericRecord): string {

            const {
                method
            } = this;

            if (method !== undefined) {

                return typeof method === 'function' ?
                    method() :
                    method; // The user set an specific method
            }

            // Use conventions
            return data.id !== undefined ? 'PUT' : 'POST';
        }

        async handleSubmitData(data: GenericRecord) {

            await this.updateComplete;

            this.submitting = false;

            this.handleSubmitResponse(data);
        }

        async handleSubmitError(error: ErrorResponse) {

            await this.updateComplete;

            this.submitting = false;

            this.error = error;

            this.renderError();
        }
    }
}