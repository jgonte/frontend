import { ValidatorOptions } from "../Validator";
import SingleValueFieldValidator, { SingleValueFieldValidationContext } from "./SingleValueFieldValidator";

export interface RequiredValidatorOptions extends ValidatorOptions {

    /** If true, allows '' as a valid value */
    allowEmpty?: boolean;
}

export default class RequiredValidator extends SingleValueFieldValidator {

    /** If true, allows '' as a valid value */
    allowEmpty: boolean;

    constructor(options: RequiredValidatorOptions = {}) {

        super(
            '{{label}} is required',
            options);

        this.allowEmpty = options.allowEmpty || false;
    }

    validate(context: SingleValueFieldValidationContext): boolean {

        const {
            label,
            value
        } = context;

        let valid: boolean;

        valid = !(value === undefined || value === null);

        if (valid === true && this.allowEmpty === false) {

            valid = value !== '';
        }

        if (!valid) {

            this.emitErrors(context, { label });
        }

        return valid;
    }
}