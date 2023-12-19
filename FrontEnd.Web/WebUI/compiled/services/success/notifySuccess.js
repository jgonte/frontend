export const successEvent = "successEvent";
export default function notifySuccess(element, successMessage) {
    element.dispatchCustomEvent(successEvent, {
        successMessage
    });
}
//# sourceMappingURL=notifySuccess.js.map