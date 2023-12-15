import valueConverter from "../../../../custom-element/mixins/helpers/valueConverter";
import { DataTypes } from "../../../../utils/data/DataTypes";

describe("valueConverter tests", () => {

    it('should output false for a value false and type boolean', async () => {

        const val = valueConverter.toProperty("false", DataTypes.Boolean);

        expect(val).toEqual(false);
    });

});