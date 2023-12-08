import appCtrl from "../../../services/appCtrl";
import { SingleRecordDataProvider } from "../../data/DataProvider";
import template from "../../template";

export interface ValidationContext {

    /** The data provider for record validations */
    dataProvider?: SingleRecordDataProvider;

    /** The error messages */
    errors: string[];

    /** The warning messages */
    warnings: string[];
}

export interface ValidatorOptions {

    message?: string;
}

export default abstract class Validator {

    /** 
     * The message to override using the options
     */
    message: string;

    constructor(defaultMessage: string, options: ValidatorOptions) {

        this.message = options?.message || defaultMessage;

        const intlProvider = appCtrl.intlProvider;

        if (intlProvider !== undefined) {

            this.message = intlProvider.getTranslation(intlProvider.lang, this.message) || this.message;
        }
    }

    abstract validate(context: ValidationContext): boolean | Promise<boolean>;

    /**
     * Adds an error message to the arrays of errors of the context
     * @param context The context containing the array of errors
     * @param data The data to replace the template placeholders with
     */
    emitErrors(context: ValidationContext, data: (object & Record<string, string | number>)) {

        const result = template(this.message as string, data);

        context.errors.push(result.text as string);
    }

    /**
     * Adds an warning message to the arrays of warnings of the context
     * @param context The context containing the array of warnings
     * @param data The data to replace the template placeholders with
     */
    emitWarnings(context: ValidationContext, data: (object & Record<string, string | number>)) {

        const result = template(this.message as string, data);

        context.warnings.push(result.text as string);
    }
}