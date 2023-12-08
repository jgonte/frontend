import { ValidatorOptions } from "../Validator";
import SingleValueFieldValidator, { SingleValueFieldValidationContext } from "./SingleValueFieldValidator";
export interface RangeValidatorOptions extends ValidatorOptions {
    minValue?: number;
    maxValue?: number;
}
export default class RangeValidator extends SingleValueFieldValidator {
    minValue: number;
    maxValue: number;
    constructor(options?: RangeValidatorOptions);
    validate(context: SingleValueFieldValidationContext): boolean;
}
