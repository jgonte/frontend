import isPrimitive from "../../utils/isPrimitive";

describe('string isPrimitive tests', () => {

	it('returns true when the object is a string', () => {

		const result = isPrimitive('text');

		expect(result).toEqual(true);
	});

	it('returns true when the object is numeric', () => {

		const result = isPrimitive(26);

		expect(result).toEqual(true);
	});

    it('returns false when the object is an object', () => {

		const result = isPrimitive({
			name: 'Sarah',
			age: 20
		});

		expect(result).toEqual(false);
	});

	it('returns false when the object is null', () => {

		const result = isPrimitive(null);

		expect(result).toEqual(false);
	});

	it('returns false when the object is a function', () => {

		const result = isPrimitive(() =>{

			console.log('This is a function');
		});

		expect(result).toEqual(false);
	});

});