import { toCamelCase } from "../../utils/string";

describe('string toCamelCase tests', () => {

	it('converts to camel case', () => {

		expect(toCamelCase('')).toBe('');

		expect(toCamelCase('data')).toBe('data');

		expect(toCamelCase('item-template')).toBe('itemTemplate');

		expect(toCamelCase('item_template')).toBe('itemTemplate');

		expect(toCamelCase('item template')).toBe('itemTemplate');
	});

});