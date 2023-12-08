import { ValidatorOptions } from "../Validator";
import RecordValidator, { RecordValidationContext } from "./RecordValidator";
export interface CustomRecordValidatorOptions extends ValidatorOptions {
    validateFcn: (value: unknown) => boolean;
}
export default class CustomRecordValidator extends RecordValidator {
    validateFcn: (value: unknown) => boolean;
    constructor(message: string, options: CustomRecordValidatorOptions);
    validate(context: RecordValidationContext): boolean;
}
