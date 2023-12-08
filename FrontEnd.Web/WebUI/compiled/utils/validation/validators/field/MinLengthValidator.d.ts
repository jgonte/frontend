import { ValidatorOptions } from "../Validator";
import SingleValueFieldValidator, { SingleValueFieldValidationContext } from "./SingleValueFieldValidator";
export interface MinLengthValidatorOptions extends ValidatorOptions {
    minLength: number;
}
export default class MinLengthValidator extends SingleValueFieldValidator {
    minLength: number;
    constructor(options: MinLengthValidatorOptions);
    validate(context: SingleValueFieldValidationContext): boolean;
}
