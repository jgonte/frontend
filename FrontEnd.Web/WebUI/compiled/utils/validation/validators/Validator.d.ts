import { SingleRecordDataProvider } from "../../data/DataProvider";
export interface ValidationContext {
    dataProvider?: SingleRecordDataProvider;
    errors: string[];
    warnings: string[];
}
export interface ValidatorOptions {
    message?: string;
}
export default abstract class Validator {
    message: string;
    constructor(defaultMessage: string, options: ValidatorOptions);
    abstract validate(context: ValidationContext): boolean | Promise<boolean>;
    emitErrors(context: ValidationContext, data: (object & Record<string, string | number>)): void;
    emitWarnings(context: ValidationContext, data: (object & Record<string, string | number>)): void;
}
