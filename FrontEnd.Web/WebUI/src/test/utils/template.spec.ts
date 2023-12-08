import template from "../../utils/template";

describe('template tests', () => {

	it('returns the original string when there is no data passed', () => {

		const result = template('some text');

		expect(result.text).toEqual('some text');

		expect(result.keysNotInData).toEqual([]);
	});

	it('returns the original string when there is data passed but it does not match the name of the place holders', () => {

		const result = template('some text', {
			param1: 123,
			param2: 'Some text'
		});

		expect(result.text).toEqual('some text');

		expect(result.keysNotInData).toEqual(['param1', 'param2']);
	});

	it('changes the original string when there is data passed but it matches the name of the place holders', () => {

		const result = template('some text {{param1}}', {
			param1: 123,
			param2: 'Some text'
		});

		expect(result.text).toEqual('some text 123');

		expect(result.keysNotInData).toEqual(['param2']);
	});

	it('changes the original string when there is data passed but it matches the name of the place holders, even repeated times', () => {

		const result = template('some text {{param1}} ... wait, it is a number! {{param1}}', {
			param1: 123,
			param2: 'Some text'
		});

		expect(result.text).toEqual('some text 123 ... wait, it is a number! 123');

		expect(result.keysNotInData).toEqual(['param2']);
	});

	it('changes the original string when there is data passed but it matches the name of the place holders for multiple parameters', () => {

		const result = template("some text: '{{param2}}' and number: '{{param1}}'", {
			param1: 123,
			param2: 'Some text'
		});

		expect(result.text).toEqual("some text: 'Some text' and number: '123'");

		expect(result.keysNotInData).toEqual([]);
	});

	it('returns the original string when there is data passed but it does not match the name of the place holders at the beginning', () => {

		const result = template("{{label}} is required", {
			name: 'Field1'
		});

		expect(result.text).toEqual("{{label}} is required");

		expect(result.keysNotInData).toEqual(['name']);
	});

});