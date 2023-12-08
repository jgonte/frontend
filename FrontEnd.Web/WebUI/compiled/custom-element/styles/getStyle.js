export default function getStyle(props) {
    return Object.keys(props).reduce((acc, key) => (acc + key.split(/(?=[A-Z])/).join('-').toLowerCase() + ':' + props[key] + ';'), '');
}
//# sourceMappingURL=getStyle.js.map