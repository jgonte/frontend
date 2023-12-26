import html from "../../../rendering/html";
import notifyError from "../../../services/errors/notifyError";
import notifySuccess from "../../../services/success/notifySuccess";
import { DataTypes } from "../../../utils/data/DataTypes";
import Fetcher, { ContentMultipartFormData, ContentTypeApplicationJson } from "../../../utils/data/transfer/Fetcher";
export default function Submittable(Base) {
    return class SubmittableMixin extends Base {
        static get properties() {
            return {
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
        static get state() {
            return {
                submitting: {
                    value: false
                }
            };
        }
        renderSubmitting() {
            const { submitting } = this;
            if (submitting === false) {
                return null;
            }
            return html `<gcs-overlay>
                <gcs-alert kind="info" >...Submitting</gcs-alert>
            </gcs-overlay>`;
        }
        connectedCallback() {
            super.connectedCallback?.();
            this._submitFetcher = new Fetcher({
                onData: data => this.handleSubmitData(data),
                onSuccess: () => this.handleSuccess('Record was successfully submitted.'),
                onError: error => this.handleSubmitError(error)
            });
        }
        submit() {
            this.submitting = true;
            const data = this.getSubmitData();
            this._submitFetcher.fetch({
                url: this.submitUrl,
                method: this.getMethod(data),
                contentType: this.getContentType(),
                data
            });
        }
        getContentType() {
            const fileField = this.findChild((c) => c.nodeName === "GCS-FILE-FIELD");
            if (fileField) {
                return ContentMultipartFormData;
            }
            return ContentTypeApplicationJson;
        }
        getMethod(data) {
            const { method } = this;
            if (method !== undefined) {
                return typeof method === 'function' ?
                    method() :
                    method;
            }
            return data.id !== undefined ? 'PUT' : 'POST';
        }
        handleSubmitData(data) {
            this.submitting = false;
            this.handleSubmitResponse(data);
        }
        handleSuccess(successMessage) {
            this.submitting = false;
            notifySuccess(this, successMessage);
        }
        handleSubmitError(error) {
            this.submitting = false;
            notifyError(this, error);
        }
    };
}
//# sourceMappingURL=Submittable.js.map