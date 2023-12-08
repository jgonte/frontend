import { DataTypes } from "../../../utils/data/DataTypes";
import createValidator from "../../../utils/validation/createValidator";
export const validationEvent = 'validationEvent';
export default function Validatable(Base) {
    return class ValidatableMixin extends Base {
        static get properties() {
            return {
                validators: {
                    type: [
                        DataTypes.Function,
                        DataTypes.Array
                    ],
                    value: [],
                    beforeSet: function (value) {
                        return this.initializeValidators(value);
                    }
                }
            };
        }
        validate() {
            if (this.validators.length === 0) {
                return true;
            }
            const context = this.createValidationContext();
            this.validators.forEach((validator) => validator.validate(context));
            const { warnings, errors } = context;
            this.dispatchCustomEvent(validationEvent, {
                warnings,
                errors
            });
            return errors.length === 0;
        }
        initializeValidators(validators) {
            for (let i = 0; i < validators.length; ++i) {
                const validator = validators[i];
                if (validator.validate === undefined) {
                    validators[i] = createValidator(validator);
                }
            }
            return validators;
        }
    };
}
//# sourceMappingURL=Validatable.js.map