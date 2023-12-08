import appCtrl from "../../../../services/appCtrl";
import IntlProvider from "../../../../services/intl/IntlProvider";
import MinLengthValidator from "../../../../utils/validation/validators/field/MinLengthValidator";
beforeEach(() => {
    appCtrl.intlProvider = undefined;
});
describe("MinLengthValidator tests", () => {
    it("MinLengthValidator with undefined value should not validate", () => {
        const validator = new MinLengthValidator({
            minLength: 5
        });
        const validationContext = {
            label: 'First Name',
            errors: [],
            warnings: [],
            value: undefined
        };
        const valid = validator.validate(validationContext);
        expect(valid).toEqual(true);
    });
    it("MinLengthValidator with length equal to minLength should be valid", () => {
        const validator = new MinLengthValidator({
            minLength: 5
        });
        const validationContext = {
            label: 'First Name',
            errors: [],
            warnings: [],
            value: "12345"
        };
        const valid = validator.validate(validationContext);
        expect(valid).toEqual(true);
    });
    it("MinLengthValidator with length greater than minLength should be valid", () => {
        const validator = new MinLengthValidator({
            minLength: 5
        });
        const validationContext = {
            label: 'First Name',
            errors: [],
            warnings: [],
            value: "123456"
        };
        const valid = validator.validate(validationContext);
        expect(valid).toEqual(true);
    });
    it("MinLengthValidator with length of the value less than minLength should emit a validation error message with support for localization", () => {
        appCtrl.intlProvider = new IntlProvider("de", {
            'en': {
                '{{label}} is cannot have less than 5 characters': '{{label}} is cannot have less than 5 characters'
            },
            'de': {
                '{{label}} is cannot have less than 5 characters': '{{label}} darf nicht weniger als 5 Zeichen haben'
            },
            'fr': {
                '{{label}} is cannot have less than 5 characters': '{{label}} ne peut pas avoir moins de 5 caractères'
            }
        });
        const validator = new MinLengthValidator({
            minLength: 5
        });
        const validationContext = {
            label: 'Vollständiger Name',
            errors: [],
            warnings: [],
            value: "1234"
        };
        const valid = validator.validate(validationContext);
        expect(valid).toEqual(false);
        expect(validationContext.errors[0]).toEqual('Vollständiger Name darf nicht weniger als 5 Zeichen haben');
    });
});
//# sourceMappingURL=MinLengthValidator.spec.js.map