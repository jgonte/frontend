import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import { DataTypes } from "../../../utils/data/DataTypes";
import createValidator from "../../../utils/validation/createValidator";
import Validator, { ValidationContext } from "../../../utils/validation/validators/Validator";
import { ValidatorConfig } from "../../../utils/validation/validators/ValidatorConfig";

export const validationEvent = 'validationEvent';

export default function Validatable<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class ValidatableMixin extends Base {

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                validators: {
                    type: [
                        DataTypes.Function,
                        DataTypes.Array
                    ],
                    value: [],
                    beforeSet: function (value): unknown {

                        return (this as unknown as ValidatableMixin).initializeValidators(value as (Validator | ValidatorConfig)[]);
                    }
                }
            };
        }

        /**
         * Validates a validatable object
         * @returns true is the value is valid, false otherwise
         */
        validate(): boolean {

            if (this.validators.length === 0) {

                return true; // Nothing to validate
            }

            // Create a new validation context
            const context: ValidationContext = this.createValidationContext();

            // Validate
            this.validators.forEach((validator: Validator) => validator.validate(context));

            const {
                warnings,
                errors
            } = context;

            // Dispatch the event even if there are no errors to trigger a repaint and remove previous errors
            this.dispatchCustomEvent(validationEvent, {
                warnings,
                errors
            });

            return errors.length === 0;
        }

        /**
         * Creates validator objects from the configuration or keeps the existing ones
         * @param validators The configuration or existing validatos
         * @returns 
         */

        initializeValidators(validators: (ValidatorConfig | Validator)[]): Validator[] {

            for (let i = 0; i < validators.length; ++i) {

                const validator = validators[i];

                if ((validator as unknown as Validator).validate === undefined) {

                    validators[i] = createValidator(validator as ValidatorConfig);
                }
            }

            return validators as Validator[];
        }
    }
}
