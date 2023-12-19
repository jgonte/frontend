import Field from "../../../../components/fields/Field";
import DataResponse from "../../../data/transfer/DataResponse";
import { AnyError } from "../../../../services/errors/notifyError";
import { ValidatorOptions } from "../Validator";
import SingleValueFieldValidator, { SingleValueFieldValidationContext } from "./SingleValueFieldValidator";
export interface ServerFieldValidatorOptions extends ValidatorOptions {
    url?: string;
}
export default class ServerFieldValidator extends SingleValueFieldValidator {
    url: string;
    constructor(options?: ServerFieldValidatorOptions);
    validate(context: SingleValueFieldValidationContext): Promise<boolean>;
    handleValidationData(context: SingleValueFieldValidationContext, data: DataResponse): void;
    handleError(field: Field, error: AnyError): void;
}
