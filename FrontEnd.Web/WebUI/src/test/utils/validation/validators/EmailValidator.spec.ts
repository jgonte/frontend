import EmailValidator from "../../../../utils/validation/validators/field/EmailValidator";
import { SingleValueFieldValidationContext } from "../../../../utils/validation/validators/field/SingleValueFieldValidator";

describe("EmailValidator tests", () => {

    it("EmailValidator with an undefined value should emit no errors", () => {

        const validator = new EmailValidator();

        const validationContext : SingleValueFieldValidationContext = {
            label: 'Customer Email',
            errors: [],
            warnings: [],
            value: undefined
        };

        const valid = validator.validate(validationContext);

        expect(valid).toEqual(true);

        expect(validationContext.errors.length).toEqual(0);
    });

    it("EmailValidator with invalid value should emit a validation error message", () => {

        const validator = new EmailValidator();

        const validationContext : SingleValueFieldValidationContext = {
            label: 'Customer Email',
            errors: [],
            warnings: [],
            value: 'some.email'
        };

        const valid = validator.validate(validationContext);

        expect(valid).toEqual(false);

        expect(validationContext.errors[0]).toEqual('Customer Email is not a valid email');
    });

    it("EmailValidator with a defined value should emit no errors", () => {

        const validator = new EmailValidator();

        const validationContext : SingleValueFieldValidationContext = {
            label: 'Customer Email',
            errors: [],
            warnings: [],
            value: 'sarah@example.com'
        };

        const valid = validator.validate(validationContext);

        expect(valid).toEqual(true);

        expect(validationContext.errors.length).toEqual(0);
    });
});