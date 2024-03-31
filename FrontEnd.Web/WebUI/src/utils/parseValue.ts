export default function parseValue(value: string): unknown {

    // Trim whitespace
    value = value.trim();

    // Remove surrounding quotes if present
    if ((value.startsWith("'") && value.endsWith("'")) || 
        (value.startsWith('"') && value.endsWith('"'))) {

        value = value.slice(1, -1);
    }

    // Unescape escaped characters
    value = value.replace(/\\(.)/g, "$1");

    // Attempt to parse as number
    const numberRegex = /^[+-]?\d+(\.\d+)?$/; // Regex to match numbers

    if (numberRegex.test(value)) {

        return parseFloat(value);
    }

    // Attempt to parse as boolean
    const lowerCaseValue = value.toLowerCase();

    if (lowerCaseValue === 'true' ||
        lowerCaseValue === 'false') {

        return lowerCaseValue === 'true';
    }

    // Attempt to parse as null or undefined
    if (lowerCaseValue === 'null' || 
        lowerCaseValue === 'undefined') {

        return null;
    }

    // Attempt to parse as date
    const dateValue = new Date(value);

    if (!isNaN(dateValue.getTime())) {

        return dateValue;
    }

    // Attempt to parse as JSON
    try {

        return JSON.parse(value);
    } 
    catch (error) {
        
        return value; // Unable to parse as JSON, return the original string
    }
}
