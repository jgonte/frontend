import getAllChildren from "./getAllChildren";
const _shownElements = [];
let _justShown;
const popupManager = {
    setShown(element) {
        let count = _shownElements.length;
        while (count > 0) {
            const shownElement = _shownElements[count - 1];
            if (shownElement !== element &&
                !getAllChildren(shownElement).includes(element)) {
                shownElement.hideContent();
            }
            --count;
        }
        _shownElements.push(element);
        _justShown = element;
    },
    setHidden(element) {
        while (_shownElements.length > 0) {
            const shownElement = _shownElements[_shownElements.length - 1];
            if (shownElement !== element) {
                shownElement.hideContent();
                _shownElements.pop();
            }
            else {
                _shownElements.pop();
                break;
            }
        }
    },
    handleGlobal(target) {
        if (_justShown !== undefined) {
            _justShown = undefined;
            return;
        }
        let count = _shownElements.length;
        while (count > 0) {
            const shownElement = _shownElements[count - 1];
            if (!shownElement.contains(target)
                && target.dropdown !== shownElement) {
                shownElement.hideContent();
            }
            else {
                break;
            }
            --count;
        }
    }
};
window.onclick = function (event) {
    popupManager.handleGlobal(event.target);
};
export default popupManager;
//# sourceMappingURL=popupManager.js.map