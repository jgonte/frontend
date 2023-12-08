import { ValidatorOptions } from "../Validator";
import SingleValueFieldValidator, { SingleValueFieldValidationContext } from "./SingleValueFieldValidator";

export interface RangeValidatorOptions extends ValidatorOptions {

    minValue?: number;

    maxValue?: number;
}

export default class RangeValidator extends SingleValueFieldValidator {

    minValue: number;

    maxValue: number;

    constructor(options: RangeValidatorOptions = {}) {

        super(
            '{{label}} is out of range (between {{minValue}} to {{maxValue}})',
            options);

        this.minValue = options.minValue || 0;

        this.maxValue = options.maxValue || Number.MAX_VALUE;
    }

    validate(context: SingleValueFieldValidationContext): boolean {

        const {
            label,
            value
        } = context;

        const {
            minValue,
            maxValue
        } = this;

        const valid = value as number >= minValue &&
            value as number <= maxValue;

        if (!valid) {

            this.emitErrors(context, { label });
        }

        return valid;
    }
}