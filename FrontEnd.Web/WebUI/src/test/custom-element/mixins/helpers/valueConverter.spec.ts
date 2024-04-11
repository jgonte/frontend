import valueConverter from "../../../../custom-element/mixins/helpers/valueConverter";
import { DataTypes } from "../../../../utils/data/DataTypes";

describe("valueConverter tests", () => {

    it('should output false for a value false and type boolean', () => {

        const val = valueConverter.toProperty("false", DataTypes.Boolean);

        expect(val).toEqual(false);
    });

    it('should output true for an empty value and type boolean', () => {

        const val = valueConverter.toProperty("", DataTypes.Boolean);

        expect(val).toEqual(true);
    });

    it('should output the value for the string', () => {

        const val = valueConverter.toProperty("Sarah", DataTypes.String);

        expect(val).toEqual("Sarah");
    });

    it('should output the value for the string and not a boolean', () => {

        const val = valueConverter.toProperty("Sarah", [DataTypes.String, DataTypes.Object, DataTypes.Boolean]);

        expect(val).toEqual("Sarah");
    });

    it('should output the value true for the boolean type', () => {

        const val = valueConverter.toProperty("true", [DataTypes.Boolean, DataTypes.Object]);

        expect(val).toEqual(true);
    });

    it('should output the value true for the number type', () => {

        const val = valueConverter.toProperty("13", [DataTypes.Number, DataTypes.Object]);

        expect(val).toEqual(13);
    });

    it('should output the value true for the date type', () => {

        const val = valueConverter.toProperty("2011-05-25T00:00:00", [DataTypes.Date, DataTypes.Object]);

        expect(val).toEqual(new Date("2011-05-25T00:00:00"));
    });
});