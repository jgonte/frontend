import CustomElement from "../../custom-element/CustomElement";
import { ErrorResponse } from "../../utils/data/transfer/ErrorResponse";
import { errorEvent } from "./ErrorHandler";

export type AnyError = Error | ErrorResponse | string;

export default function notifyError(element: CustomElement, error: AnyError): void {

    element.dispatchCustomEvent(errorEvent, {
        error: {
            ...error as object,
            message: getErrorMessage(error)
        }
    });
}

/**
 * Extracts the error message from the error object
 * @returns The error message from the server
 */
function getErrorMessage(error: AnyError): string {

    if (typeof error === 'string') {

        return error;
    }
    if (error instanceof Error) {

        return error.message || (error as unknown as ErrorResponse).statusText;
    }
    else { // Try to find the message of error returned by the server

        if (error.payload) {

            if (typeof error.payload === 'string') {

                return error.payload;
            }
            else if (Array.isArray(error.payload)) {

                return (error.payload as unknown as []).join('\n');
            }
            else {

                const payload = JSON.parse(error.payload as unknown as string);

                if (payload.errors !== undefined) {

                    return Object.values(payload.errors).join('\n');
                }
                else if (payload.title !== undefined) {

                    return payload.title;
                }
            }
        }
        else if (error.statusText) {

            return error.statusText as string;
        }
        else { // Create a message from the error status

            switch(error.status) {
                case 404: return 'Not Found';
                case 405: return 'Method Not Allowed';
                default: throw new Error(`Not implemented for error status: ${error.status}`);
            }

        }
    }

    throw new Error(`getErrorMessage - Unhandled error: ${error}`);
}
