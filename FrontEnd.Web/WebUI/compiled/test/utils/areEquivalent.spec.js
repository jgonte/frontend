import areEquivalent from "../../utils/areEquivalent";
describe("areEquivalent tests", () => {
    it('should return true when the values of the primitives are equal', () => {
        const value1 = 'Sarah';
        const value2 = 'Sarah';
        const result = areEquivalent(value1, value2);
        expect(result).toBeTruthy();
    });
    it('should return false when the values of the primitives are not equal', () => {
        const value1 = 'Sarah';
        const value2 = 'Mark';
        const result = areEquivalent(value1, value2);
        expect(result).toBeFalsy();
    });
    it('should return false when the values is undefined and the other is not', () => {
        const value1 = undefined;
        const value2 = 'Mark';
        const result = areEquivalent(value1, value2);
        expect(result).toBeFalsy();
    });
    it('should return true when the values of the primitives are both undefined', () => {
        const value1 = undefined;
        const value2 = undefined;
        const result = areEquivalent(value1, value2);
        expect(result).toBeTruthy();
    });
    it('should return true when the values of the primitives are null and undefined', () => {
        const value1 = undefined;
        const value2 = null;
        const result = areEquivalent(value1, value2);
        expect(result).toBeTruthy();
    });
    it('should return true when the values data are equivalent ', () => {
        const value1 = {
            id: 2,
            description: 'Item 2'
        };
        const value2 = {
            id: 2,
            description: 'Item 2'
        };
        const result = areEquivalent(value1, value2);
        expect(result).toBeTruthy();
    });
    it('should return false when the first value is null ', () => {
        const value1 = null;
        const value2 = {
            id: 2,
            description: 'Item 2'
        };
        const result = areEquivalent(value1, value2);
        expect(result).toBeFalsy();
    });
    it('should return false when the second value is null ', () => {
        const value1 = {
            id: 2,
            description: 'Item 2'
        };
        const value2 = null;
        const result = areEquivalent(value1, value2);
        expect(result).toBeFalsy();
    });
    it('should return false when the one values have an extra property', () => {
        const value1 = {
            id: 2,
            description: 'Item 2'
        };
        const value2 = {
            id: 2,
            description: 'Item 2',
            checked: true
        };
        const result = areEquivalent(value1, value2);
        expect(result).toBeFalsy();
    });
    it('should return false when the values are objects but their properties are not equivalent', () => {
        const value1 = {
            name: 'Sarah',
            id: 13
        };
        const value2 = {
            name: 'Sarah',
            id: 26
        };
        const result = areEquivalent(value1, value2);
        expect(result).toBeFalsy();
    });
    it('should return false when the classes of the objects are not equal', () => {
        class A {
        }
        class B {
        }
        const value1 = new A();
        const value2 = new B();
        const result = areEquivalent(value1, value2);
        expect(result).toBeFalsy();
    });
});
//# sourceMappingURL=areEquivalent.spec.js.map