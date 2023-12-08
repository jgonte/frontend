import isClass from "../../utils/isClass";
describe("isClass tests", () => {
    it('should return true when the value is a class definition', () => {
        expect(isClass(class Test {
        })).toBeTruthy();
    });
    it('should return true when the value is a new class definition', () => {
        expect(isClass(new (class Test {
        })())).toBeTruthy();
    });
    it('should return false when the value is a function', () => {
        expect(isClass(function () { console.log('function'); })).toBeFalsy();
    });
    it('should return false when the value is a named function', () => {
        expect(isClass(function Log() { console.log('function'); })).toBeFalsy();
    });
    it('should return false when the value is undefined', () => {
        expect(isClass(undefined)).toBeFalsy();
    });
});
//# sourceMappingURL=isClass.spec.js.map