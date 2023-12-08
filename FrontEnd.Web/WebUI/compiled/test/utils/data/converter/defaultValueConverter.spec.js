import defaultValueConverter from '../../../../utils/data/converter/defaultValueConverter';
import { DataTypes } from '../../../../utils/data/DataTypes';
describe("defaultValueConverter tests", () => {
    it("should convert from string to Boolean and viceversa", () => {
        expect(defaultValueConverter.fromString("true", DataTypes.Boolean)).toEqual(true);
        expect(defaultValueConverter.fromString("false", DataTypes.Boolean)).toEqual(false);
        expect(defaultValueConverter.toString(true, DataTypes.Boolean)).toEqual("true");
        expect(defaultValueConverter.toString(false, DataTypes.Boolean)).toEqual("false");
    });
    it("should convert from string to Date and viceversa", () => {
        expect(defaultValueConverter.fromString("2002-05-25T04:00:00.000Z", DataTypes.Date)).toEqual(new Date(2002, 4, 25));
        expect(defaultValueConverter.toString(new Date(2002, 4, 25), DataTypes.Date)).toEqual("2002-05-25T04:00:00.000Z");
    });
    it("should convert from string to Number and viceversa", () => {
        expect(defaultValueConverter.fromString("1234", DataTypes.Number)).toEqual(1234);
        expect(defaultValueConverter.toString(1234, DataTypes.Number)).toEqual("1234");
    });
});
//# sourceMappingURL=defaultValueConverter.spec.js.map