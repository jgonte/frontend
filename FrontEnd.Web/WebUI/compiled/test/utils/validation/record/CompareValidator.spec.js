import CompareValidator from "../../../../utils/validation/validators/record/CompareValidator";
describe("CompareValidator tests", () => {
    it("CompareValidator should emit an error when the values are not equal", () => {
        const dataProvider = {
            getData() {
                return {
                    verifyPassword: 'pass2'
                };
            }
        };
        const validator = new CompareValidator({
            propertyToCompare: 'verifyPassword',
            operator: 1,
            message: 'These passwords must match'
        });
        const validationContext = {
            value: 'pass1',
            errors: [],
            warnings: [],
            dataProvider
        };
        const valid = validator.validate(validationContext);
        expect(valid).toEqual(false);
        expect(validationContext.errors[0]).toEqual('These passwords must match');
    });
    it("CompareValidator should no emit errors when the values are equal", () => {
        const dataProvider = {
            getData() {
                return {
                    verifyPassword: 'pass1'
                };
            }
        };
        const validator = new CompareValidator({
            propertyToCompare: 'verifyPassword',
            operator: 1,
            message: 'Passwords must match'
        });
        const validationContext = {
            value: 'pass1',
            errors: [],
            warnings: [],
            dataProvider
        };
        const valid = validator.validate(validationContext);
        expect(valid).toEqual(true);
        expect(validationContext.errors.length).toEqual(0);
    });
});
//# sourceMappingURL=CompareValidator.spec.js.map