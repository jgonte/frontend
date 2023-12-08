import { isBlankOrWhiteSpace } from "../../utils/string";
describe('string isBlankOrWhiteSpace tests', () => {
    it('returns true when the string only has whitespaces', () => {
        const result = isBlankOrWhiteSpace(`
            \t \n \f \r \u00A0 \u2028 \u2029 \uFEFF
        `);
        expect(result).toEqual(true);
    });
    it('returns true when the string is blank', () => {
        const result = isBlankOrWhiteSpace('');
        expect(result).toEqual(true);
    });
    it('returns false when the string only has other characters besides whitespaces', () => {
        const result = isBlankOrWhiteSpace(`
        a
        `);
        expect(result).toEqual(false);
    });
});
//# sourceMappingURL=string-isBlankOrWhiteSpace.spec.js.map