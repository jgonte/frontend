export default function parseValue(value) {
    value = value.trim();
    if ((value.startsWith("'") && value.endsWith("'")) ||
        (value.startsWith('"') && value.endsWith('"'))) {
        value = value.slice(1, -1);
    }
    value = value.replace(/\\(.)/g, "$1");
    const numberRegex = /^[+-]?\d+(\.\d+)?$/;
    if (numberRegex.test(value)) {
        return parseFloat(value);
    }
    const lowerCaseValue = value.toLowerCase();
    if (lowerCaseValue === 'true' ||
        lowerCaseValue === 'false') {
        return lowerCaseValue === 'true';
    }
    if (lowerCaseValue === 'null' ||
        lowerCaseValue === 'undefined') {
        return null;
    }
    const dateValue = new Date(value);
    if (!isNaN(dateValue.getTime())) {
        return dateValue;
    }
    try {
        return JSON.parse(value);
    }
    catch (error) {
        return value;
    }
}
//# sourceMappingURL=parseValue.js.map