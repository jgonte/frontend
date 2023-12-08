export const errorEvent = "errorEvent";

export default interface ErrorHandler {

    handleError: (event: CustomEvent) => void;
}