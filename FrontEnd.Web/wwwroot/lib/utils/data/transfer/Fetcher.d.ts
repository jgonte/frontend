import DataResponse from "./DataResponse";
import { GenericRecord } from "../../types";
import { ErrorResponse } from "./ErrorResponse";
import { FetchCallbacks } from "./FetchCallbacks";
import { FetchRequest } from "./FetchRequest";
export declare const ContentType = "Content-Type";
export declare const ContentTypeApplicationJson = "application/json";
export declare const ContentMultipartFormData = "multipart/form-data";
export declare const ContentTypeTextPlain = "text/plain";
export default class Fetcher implements FetchCallbacks {
    onResponse?: (response: Response) => void;
    onSuccess?: () => void;
    onError?: (error: ErrorResponse) => void;
    onData?: (data: DataResponse) => void;
    constructor(callbacks: FetchCallbacks);
    fetch(request: FetchRequest): Promise<void>;
    buildUrl(request: FetchRequest): string;
    buildHeaders(request: FetchRequest): Promise<HeadersInit>;
    buildBody(request: FetchRequest): FormData | string | undefined;
    processResponse(response: Response): Promise<void>;
    parseContent(response: Response): Promise<GenericRecord | string>;
    handleError(error: ErrorResponse): void;
}
