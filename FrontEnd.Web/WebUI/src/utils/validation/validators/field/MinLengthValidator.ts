import isUndefinedOrNull from "../../../isUndefinedOrNull";
import { ValidatorOptions } from "../Validator";
import SingleValueFieldValidator, { SingleValueFieldValidationContext } from "./SingleValueFieldValidator";

export interface MinLengthValidatorOptions extends ValidatorOptions {

    minLength: number;
}

export default class MinLengthValidator extends SingleValueFieldValidator {

    minLength: number;

    constructor(options: MinLengthValidatorOptions) {

        super(
            `{{label}} is cannot have less than ${options.minLength} characters`,
            options);

        this.minLength = options.minLength;
    }

    validate(context: SingleValueFieldValidationContext): boolean {

        const {
            label,
            value
        } = context;

        const {
            minLength
        } = this;

        const valid = isUndefinedOrNull(value) ||
            (value as string).length >= minLength;

        if (!valid) {

            this.emitErrors(context, { label });
        }

        return valid;
    }
}