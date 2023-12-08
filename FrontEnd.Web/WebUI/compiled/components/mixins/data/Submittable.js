import html from "../../../rendering/html";
import { DataTypes } from "../../../utils/data/DataTypes";
import Fetcher, { ContentTypeApplicationJson } from "../../../utils/data/transfer/Fetcher";
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
                onError: error => this.handleSubmitError(error)
            });
        }
        submit() {
            this.error = undefined;
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
        async handleSubmitData(data) {
            await this.updateComplete;
            this.submitting = false;
            this.handleSubmitResponse(data);
        }
        async handleSubmitError(error) {
            await this.updateComplete;
            this.submitting = false;
            this.error = error;
            this.renderError();
        }
    };
}
//# sourceMappingURL=Submittable.js.map