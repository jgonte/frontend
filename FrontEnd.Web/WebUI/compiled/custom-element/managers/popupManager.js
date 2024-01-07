const _openPopups = [];
function closeOtherPopups(target) {
    let count = _openPopups.length;
    while (count > 0) {
        const popup = _openPopups[count - 1];
        if (popup === target) {
            break;
        }
        const targetChildren = target.adoptedChildren;
        const popupIsChildOfTarget = targetChildren &&
            Array.from(targetChildren)
                .includes(popup);
        if (popupIsChildOfTarget) {
            break;
        }
        popup.hideContent?.();
        --count;
    }
}
const popupManager = {
    add(element) {
        closeOtherPopups(element);
        _openPopups.push(element);
    },
    remove(element) {
        const index = _openPopups.indexOf(element);
        if (index !== -1) {
            _openPopups.splice(index, 1);
        }
    }
};
document.addEventListener('click', event => closeOtherPopups(event.target));
export default popupManager;
//# sourceMappingURL=popupManager.js.map