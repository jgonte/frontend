import Field from "../../../../components/fields/Field";
import FormField from "../../../../components/form/form-field/FormField";
import LoaderData from "../../../../components/loader/LoaderData";
import notifyError, { AnyError } from "../../../../services/errors/notifyError";
import Fetcher, { ContentTypeTextPlain } from "../../../data/transfer/Fetcher";
import { ValidatorOptions } from "../Validator";
import SingleValueFieldValidator, { SingleValueFieldValidationContext } from "./SingleValueFieldValidator";

export interface ServerFieldValidatorOptions extends ValidatorOptions {

    url?: string;
}

export default class ServerFieldValidator extends SingleValueFieldValidator {

    url: string;

    constructor(options: ServerFieldValidatorOptions = {}) {

        super('{{label}} is invalid', options);

        const {
            url
        } = options;

        if (url === undefined) {

            throw new Error('url is required');
        }

        this.url = url;
    }

    async validate(context: SingleValueFieldValidationContext): Promise<boolean> {

        const {
            field,
            label,
            value
        } = context;

        const {
            form
        } = field as Field;

        form.loading = true;

        const fetcher = new Fetcher({
            onData: data => this.handleValidationData(context, data),
            onError: error => this.handleError(field as Field, error)
        });

        fetcher.contentType = ContentTypeTextPlain;

        await fetcher.fetch({
            url: this.url,
            method: 'POST',
            data: value as string
        });

        const valid = context.errors.length === 0;

        if (!valid) {

            this.emitErrors(context, { label });
        }

        return valid;
    }

    handleValidationData(context: SingleValueFieldValidationContext, data: LoaderData) {

        (context.field as Field).form.loading = false;

        ((context.field as Field).parentElement as FormField).errors = (data.payload || data) as unknown as string[];
    }

    handleError(field: Field, error: AnyError) {

        field.form.loading = false;

        notifyError(field, error);
    }
}