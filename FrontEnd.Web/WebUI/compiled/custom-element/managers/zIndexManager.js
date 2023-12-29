const _zIndexInitial = 1000;
const _zIndexIncrement = 10;
const _elements = [];
const zIndexManager = {
    add(element) {
        const el = _elements[_elements.length - 1];
        if (el) {
            const zIndex = parseInt(el.style.zIndex) + _zIndexIncrement;
            element.style.zIndex = zIndex.toString();
        }
        else {
            element.style.zIndex = _zIndexInitial.toString();
        }
        _elements.push(element);
    },
    remove(element) {
        const el = _elements.pop();
        if (el &&
            el !== element) {
            console.error('Removed element must be the last one');
        }
    }
};
export default zIndexManager;
//# sourceMappingURL=zIndexManager.js.map