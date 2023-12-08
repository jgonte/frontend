import { ValidatorOptions } from "../Validator";
import RecordValidator, { RecordValidationContext } from "./RecordValidator";

export interface CustomRecordValidatorOptions extends ValidatorOptions {

    validateFcn: (value: unknown) => boolean;
}

export default class CustomRecordValidator extends RecordValidator {

    validateFcn: (value: unknown) => boolean;

    constructor(message: string, options: CustomRecordValidatorOptions) {

        super(message, options);

        this.validateFcn = options.validateFcn;
    }

    validate(context: RecordValidationContext): boolean {

        const data = this.getData(context);

        const valid = this.validateFcn.call(this, data);

        if (!valid) {

            this.emitErrors(context, { });
        }

        return valid;
    }
   
}