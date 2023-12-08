export default function css(strings, ...values) {
    return values.reduce((acc, val, idx) => [...acc, val, strings[idx + 1]], [strings[0]]).join('');
}
//# sourceMappingURL=css.js.map