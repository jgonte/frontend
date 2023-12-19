import notifyError from "../../../../services/errors/notifyError";
import Fetcher, { ContentTypeTextPlain } from "../../../data/transfer/Fetcher";
import SingleValueFieldValidator from "./SingleValueFieldValidator";
export default class ServerFieldValidator extends SingleValueFieldValidator {
    url;
    constructor(options = {}) {
        super('{{label}} is invalid', options);
        const { url } = options;
        if (url === undefined) {
            throw new Error('url is required');
        }
        this.url = url;
    }
    async validate(context) {
        const { field, label, value } = context;
        const { form } = field;
        form.loading = true;
        const fetcher = new Fetcher({
            onData: data => this.handleValidationData(context, data),
            onError: error => this.handleError(field, error)
        });
        await fetcher.fetch({
            url: this.url,
            method: 'POST',
            headers: {
                'Content-Type': ContentTypeTextPlain
            },
            data: value
        });
        const valid = context.errors.length === 0;
        if (!valid) {
            this.emitErrors(context, { label });
        }
        return valid;
    }
    handleValidationData(context, data) {
        context.field.form.loading = false;
        context.field.parentElement.errors = (data.payload || data);
    }
    handleError(field, error) {
        field.form.loading = false;
        notifyError(field, error);
    }
}
//# sourceMappingURL=ServerFieldValidator.js.map