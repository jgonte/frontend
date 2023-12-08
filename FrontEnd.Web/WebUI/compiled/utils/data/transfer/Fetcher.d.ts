import LoaderData from "../../../components/loader/LoaderData";
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
    onError?: (error: ErrorResponse) => void;
    onData?: (data: LoaderData) => void;
    contentType?: string;
    constructor(callbacks: FetchCallbacks);
    fetch(request: FetchRequest): Promise<LoaderData | null | undefined>;
    buildUrl(request: FetchRequest): string;
    buildHeaders(request: FetchRequest): Promise<HeadersInit>;
    buildBody(request: FetchRequest): FormData | string | undefined;
    processResponse(response: Response): Promise<LoaderData | undefined>;
    parseContent(response: Response): Promise<GenericRecord | string>;
    handleError(error: ErrorResponse): void;
}
