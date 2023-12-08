export function isBlankOrWhiteSpace(str) {
    return str === '' || /^\s+$/.test(str);
}
export function toCamelCase(str) {
    return (str.slice(0, 1).toLowerCase() + str.slice(1))
        .replace(/([-_ ]){1,}/g, ' ')
        .split(/[-_ ]/)
        .reduce((cur, acc) => {
        return cur + acc[0].toUpperCase() + acc.substring(1);
    });
}
//# sourceMappingURL=string.js.map