export default function getClasses(props) {
    const classes = [];
    for (const key in props) {
        if (props.hasOwnProperty(key)) {
            if (props[key] === true) {
                classes.push(key);
            }
        }
    }
    return classes.join(' ');
}
//# sourceMappingURL=getClasses.js.map