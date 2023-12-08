import appCtrl from "../../../../services/appCtrl";
import IntlProvider from "../../../../services/intl/IntlProvider";
import MaxLengthValidator from "../../../../utils/validation/validators/field/MaxLengthValidator";
beforeEach(() => {
    appCtrl.intlProvider = undefined;
});
describe("MaxLengthValidator tests", () => {
    it("MaxLengthValidator with undefined value should not validate", () => {
        const validator = new MaxLengthValidator({
            maxLength: 5
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
    it("MaxLengthValidator with length equal to maxLength should be valid", () => {
        const validator = new MaxLengthValidator({
            maxLength: 5
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
    it("MaxLengthValidator with length less than maxLength should be valid", () => {
        const validator = new MaxLengthValidator({
            maxLength: 5
        });
        const validationContext = {
            label: 'First Name',
            errors: [],
            warnings: [],
            value: "1234"
        };
        const valid = validator.validate(validationContext);
        expect(valid).toEqual(true);
    });
    it("MaxLengthValidator with length of the value greater than maxLength should emit a validation error message with support for localization", () => {
        appCtrl.intlProvider = new IntlProvider("de", {
            'en': {
                '{{label}} is cannot have more than 5 characters': '{{label}} is cannot have more than 5 characters'
            },
            'de': {
                '{{label}} is cannot have more than 5 characters': '{{label}} darf nicht mehr als 5 Zeichen haben'
            },
            'fr': {
                '{{label}} is cannot have more than 5 characters': '{{label}} ne peut pas avoir plus de 5 caractères'
            }
        });
        const validator = new MaxLengthValidator({
            maxLength: 5
        });
        const validationContext = {
            label: 'Vollständiger Name',
            errors: [],
            warnings: [],
            value: "123456"
        };
        const valid = validator.validate(validationContext);
        expect(valid).toEqual(false);
        expect(validationContext.errors[0]).toEqual('Vollständiger Name darf nicht mehr als 5 Zeichen haben');
    });
});
//# sourceMappingURL=MaxLengthValidator.spec.js.map