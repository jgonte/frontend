import CustomElement from "../../custom-element/CustomElement";

export const successEvent = "successEvent";

export default function notifySuccess(element: CustomElement, successMessage: string): void {

    element.dispatchCustomEvent(successEvent, {
        successMessage
    });
}