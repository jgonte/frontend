import parseFunctionCall from "../../utils/parseFunctionCall";

describe("areEquivalent tests", () => {

    it('should parse a function call without parameters', () => {

        const result = parseFunctionCall("call()");

        expect(result?.functionName).toEqual("call");

        expect(result?.parameters.length).toEqual(0);
    });

    it('should parse a function call without parameters', () => {

        const result = parseFunctionCall('call("hello")');

        expect(result?.functionName).toEqual("call");

        expect(result?.parameters.length).toEqual(1);

        expect(result?.parameters[0]).toEqual("hello");
    });

    it('should parse a function call with parameters', () => {

        const result = parseFunctionCall("call(5, 'hello', true, '2024-03-29')");

        expect(result?.functionName).toEqual("call");

        expect(result?.parameters.length).toEqual(4);

        expect(result?.parameters[0]).toEqual(5);

        expect(result?.parameters[1]).toEqual("hello");

        expect(result?.parameters[2]).toEqual(true);

        expect(result?.parameters[3]).toEqual(new Date("2024-03-29T00:00:00.000Z"));
    });
});