import addPatcherComparer from "../../../rendering/utils/addPatcherComparer";
import areEquivalent from "../../../utils/areEquivalent";

addPatcherComparer();

describe("areEquivalent tests", () => {

    it('should return true when the values have same patcher properties', () => {

        const patcher = {};

        const value1 = {
            patcher
        };

        const value2 = {
            patcher
        };

        const result = areEquivalent(value1, value2);

        expect(result).toBeTruthy();
    });

    it('should return false when the values have different patcher properties', () => {

        const value1 = {
            patcher: {}
        };

        const value2 = {
            patcher: {}
        };

        const result = areEquivalent(value1, value2);

        expect(result).toBeFalsy();
    });

    it('should return true when the values are arrays of equivalent items', () => {

        const patcher = {};

        const patcher1 = {
            patcher
        };

        const patcher2 = {
            patcher
        };

        const value1 = [
            'Sarah',
            patcher1
        ];

        const value2 = [
            'Sarah',
            patcher2
        ];

        const result = areEquivalent(value1, value2);

        expect(result).toBeTruthy();
    });

    it('should return false when the values are arrays of non equivalent items', () => {

        const patcher1 = {
            patcher: {}
        };

        const patcher2 = {
            patcher: {}
        };

        const value1 = [
            'Sarah',
            patcher1
        ];

        const value2 = [
            'Sarah',
            patcher2
        ];

        const result = areEquivalent(value1, value2);

        expect(result).toBeFalsy();
    });

    it('should return false when the values are arrays but have different lengths', () => {

        const patcher = {};

        const patcher1 = {
            patcher
        };

        const patcher2 = {
            patcher
        };

        const value1 = [
            'Sarah',
            patcher1,
            13
        ];

        const value2 = [
            'Sarah',
            patcher2
        ];

        const result = areEquivalent(value1, value2);

        expect(result).toBeFalsy();
    });
});