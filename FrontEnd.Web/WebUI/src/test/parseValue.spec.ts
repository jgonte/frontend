import parseValue from "../utils/parseValue";

describe('parseValue tests', () => {

    it('should parse string numbers to numbers', () => {

      expect(parseValue('42')).toBe(42);

      expect(parseValue('-10')).toBe(-10);

      expect(parseValue('3.14')).toBeCloseTo(3.14);
    });
  
    it('should parse boolean strings to booleans', () => {

      expect(parseValue('true')).toBe(true);

      expect(parseValue('false')).toBe(false);
    });
  
    it('should parse null and undefined strings to null', () => {

      expect(parseValue('null')).toBeNull();

      expect(parseValue('undefined')).toBeNull();
    });
  
    it('should parse ISO date strings to Date objects', () => {

      const date = new Date('2024-03-29T00:00:00.000Z');

      expect(parseValue('2024-03-29')).toEqual(date);
    });
  
    it('should parse JSON strings to objects', () => {

      expect(parseValue('{"name":"John","age":30}')).toEqual({ name: 'John', age: 30 });

      expect(parseValue('[1, 2, 3]')).toEqual([1, 2, 3]);
    });
  
    it('should remove surrounding quotes', () => {

      expect(parseValue("'hello'")).toBe('hello');

      expect(parseValue('"hello"')).toBe('hello');
    });
  
    it('should unescape escaped characters', () => {

      expect(parseValue('"\\"hello\\""')).toBe("hello");

      expect(parseValue("'\\'hello\\''")).toBe("'hello'");
    });
  
    it('should return the original string if cannot parse', () => {

      expect(parseValue('hello')).toBe('hello');
      
      expect(parseValue('not_a_number')).toBe('not_a_number');
    });
  });