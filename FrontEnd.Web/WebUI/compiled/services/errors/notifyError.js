import { errorEvent } from "./ErrorHandler";
export default function notifyError(element, error) {
    element.dispatchCustomEvent(errorEvent, {
        error: {
            ...error,
            message: getErrorMessage(error)
        }
    });
}
function getErrorMessage(error) {
    if (typeof error === 'string') {
        return error;
    }
    if (error instanceof Error) {
        return error.message || error.statusText;
    }
    else {
        if (error.payload) {
            if (typeof error.payload === 'string') {
                return error.payload;
            }
            else if (Array.isArray(error.payload)) {
                return error.payload.join('\n');
            }
            else {
                const payload = JSON.parse(error.payload);
                if (payload.errors !== undefined) {
                    return Object.values(payload.errors).join('\n');
                }
                else if (payload.title !== undefined) {
                    return payload.title;
                }
            }
        }
        else if (error.statusText) {
            return error.statusText;
        }
        else {
            switch (error.status) {
                case 404: return 'Resource not found';
                default: throw new Error(`Not implemented for error status: ${error.status}`);
            }
        }
    }
    throw new Error(`getErrorMessage - Unhandled error: ${error}`);
}
//# sourceMappingURL=notifyError.js.map