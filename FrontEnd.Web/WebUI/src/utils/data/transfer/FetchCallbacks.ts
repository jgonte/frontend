import DataResponse from "./DataResponse";
import { ErrorResponse } from "./ErrorResponse";

/**
 * Callbacks to be implemented in order to handle the different fetch scenarios
 */
 export interface FetchCallbacks {

    onResponse?: (response: Response) => void;

    onSuccess?: () => void;

    onError?: (error: ErrorResponse) => void;

    onData?: (data: DataResponse) => void;
}