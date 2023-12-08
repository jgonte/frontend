import isUndefinedOrNull from "../../../isUndefinedOrNull";
import { ValidatorOptions } from "../Validator";
import SingleValueFieldValidator, { SingleValueFieldValidationContext } from "./SingleValueFieldValidator";

export interface MaxLengthValidatorOptions extends ValidatorOptions {

    maxLength: number;
}

export default class MaxLengthValidator extends SingleValueFieldValidator {

    maxLength: number;

    constructor(options: MaxLengthValidatorOptions) {

        super(
            `{{label}} is cannot have more than ${options.maxLength} characters`,
            options);

        this.maxLength = options.maxLength;
    }

    validate(context: SingleValueFieldValidationContext): boolean {

        const {
            label,
            value
        } = context;

        const {
            maxLength
        } = this;

        const valid = isUndefinedOrNull(value) ||
            (value as string).length <= maxLength;

        if (!valid) {

            this.emitErrors(context, { label });
        }

        return valid;
    }
}