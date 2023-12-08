import { ValidatorOptions } from "../Validator";
import SingleValueFieldValidator, { SingleValueFieldValidationContext } from "./SingleValueFieldValidator";
export interface CustomFieldValidatorOptions extends ValidatorOptions {
    validateFcn: (value: string | number) => boolean;
}
export default class CustomSingleValueFieldValidator extends SingleValueFieldValidator {
    validateFcn: (value: string | number) => boolean;
    constructor(message: string, options: CustomFieldValidatorOptions);
    validate(context: SingleValueFieldValidationContext): boolean;
}
