import appCtrl from "../../../../services/appCtrl";
import IntlProvider from "../../../../services/intl/IntlProvider";
import RequiredValidator from "../../../../utils/validation/validators/field/RequiredValidator";
import { SingleValueFieldValidationContext } from "../../../../utils/validation/validators/field/SingleValueFieldValidator";

beforeEach(() => {

    appCtrl.intlProvider = undefined; // Reset
});

describe("RequiredValidator tests", () => {

    it("RequiredValidator with undefined value should emit a custom error message when it is provided through the options", () => {

        const validator = new RequiredValidator({

            message: "This field is super required" // Custom message
        });

        const validationContext: SingleValueFieldValidationContext = {
            label: 'First Name',
            errors: [],
            warnings: [],
            value: undefined
        };

        const valid = validator.validate(validationContext);

        expect(valid).toEqual(false);

        expect(validationContext.errors[0]).toEqual('This field is super required');
    });

    it("RequiredValidator with undefined value should emit a validation error message", () => {

        appCtrl.intlProvider = new IntlProvider("en", {
            'en': {
                '{{label}} is required': '{{label}} is required'
            }
        });

        const validator = new RequiredValidator();

        const validationContext: SingleValueFieldValidationContext = {
            label: 'First Name',
            errors: [],
            warnings: [],
            value: undefined
        };

        const valid = validator.validate(validationContext);

        expect(valid).toEqual(false);

        expect(validationContext.errors[0]).toEqual('First Name is required');
    });

    it("RequiredValidator with undefined value should emit a validation error message with support for localization", () => {

        appCtrl.intlProvider = new IntlProvider("de", {
            'en': {
                '{{label}} is required': '{{label}} is required'
            },
            'de': {
                '{{label}} is required': '{{label}} ist erforderlich'
            },
            'fr': {
                '{{label}} is required': '{{label}} est requis'
            }
        });

        const validator = new RequiredValidator();

        const validationContext: SingleValueFieldValidationContext = {
            label: 'Vollständiger Name',
            errors: [],
            warnings: [],
            value: undefined
        };

        const valid = validator.validate(validationContext);

        expect(valid).toEqual(false);

        expect(validationContext.errors[0]).toEqual('Vollständiger Name ist erforderlich');
    });

    it("RequiredValidator with a defined value should emit no errors", () => {

        const validator = new RequiredValidator();

        const validationContext: SingleValueFieldValidationContext = {
            label: 'First Name',
            errors: [],
            warnings: [],
            value: 'Sarah'
        };

        const valid = validator.validate(validationContext);

        expect(valid).toEqual(true);

        expect(validationContext.errors.length).toEqual(0);
    });
});