import DataResponse from "./DataResponse";
import { ErrorResponse } from "./ErrorResponse";
export interface FetchCallbacks {
    onResponse?: (response: Response) => void;
    onSuccess?: () => void;
    onError?: (error: ErrorResponse) => void;
    onData?: (data: DataResponse) => void;
}
