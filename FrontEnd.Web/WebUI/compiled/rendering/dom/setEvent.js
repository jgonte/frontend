import getGlobalFunction from "../../utils/getGlobalFunction";
import isUndefinedOrNull from "../../utils/isUndefinedOrNull";
export function setEvent(name, newValue, oldValue, node) {
    const eventName = name.slice(2).toLowerCase();
    const nameParts = eventName.split('_');
    const useCapture = nameParts[1]?.toLowerCase() === 'capture';
    const fcn = typeof newValue === 'string' ?
        getGlobalFunction(newValue) :
        newValue;
    if (isUndefinedOrNull(oldValue) &&
        !isUndefinedOrNull(fcn)) {
        node.addEventListener(eventName, fcn, useCapture);
    }
    if (!isUndefinedOrNull(oldValue) &&
        isUndefinedOrNull(fcn)) {
        const oldFcn = typeof oldValue === 'string' ?
            getGlobalFunction(oldValue) :
            oldValue;
        node.removeEventListener(eventName, oldFcn, useCapture);
    }
    node.removeAttribute(name);
    return newValue;
}
//# sourceMappingURL=setEvent.js.map