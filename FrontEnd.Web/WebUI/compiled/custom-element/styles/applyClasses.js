export default function applyClasses(element, props) {
    for (const key in props) {
        if (props.hasOwnProperty(key)) {
            if (props[key] === true) {
                element.classList.add(key);
            }
            else {
                element.classList.remove(key);
            }
        }
    }
}
//# sourceMappingURL=applyClasses.js.map