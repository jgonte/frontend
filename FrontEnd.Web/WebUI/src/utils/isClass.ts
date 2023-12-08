/**
 * Tests whether a value passed to the function is a class
 * @param value The value to test
 */
export default function isClass(value: unknown): boolean {

    return typeof value === 'function' &&
        value.toString().substring(0, 5) == 'class';
}