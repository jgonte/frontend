import { ValidatorOptions } from "./Validator";

export interface ValidatorConfig {

    /** The type of validator to create */
    type: string;

    /** The options to pass to the validator constructor */
    options: ValidatorOptions;
}
