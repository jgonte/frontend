import { ValidatorOptions } from "../Validator";
import SingleValueFieldValidator, { SingleValueFieldValidationContext } from "./SingleValueFieldValidator";

export interface RegexValidatorOptions extends ValidatorOptions {

    regex: RegExp;
}

export default abstract class RegexValidator extends SingleValueFieldValidator {

    _regex: RegExp;

    constructor(message: string, options: RegexValidatorOptions) {

        super(message, options);

        this._regex = options.regex;
    }

    validate(context: SingleValueFieldValidationContext): boolean {

        const {
            label,
            value
        } = context;

        // Assume valid if the valid is undefined
        if (value === undefined)
        {
            return true;
        }

        const valid = this._regex.test(value as string);

        if (!valid) {

            this.emitErrors(context, { label });
        }

        return valid;
    }
}