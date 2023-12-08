import isUndefinedOrNull from "../../utils/isUndefinedOrNull";

describe('string isUndefinedOrNull tests', () => {

	it('returns true when the object is undefined', () => {

		const result = isUndefinedOrNull(undefined);

		expect(result).toEqual(true);
	});

	it('returns true when the object is null', () => {

		const result = isUndefinedOrNull(null);

		expect(result).toEqual(true);
	});

    it('returns false when the object is an empty string', () => {

		const result = isUndefinedOrNull('');

		expect(result).toEqual(false);
	});
});