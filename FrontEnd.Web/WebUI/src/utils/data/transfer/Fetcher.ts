
import DataResponse from "./DataResponse";
import deserializeXmlDocument from "../../deserializeXmlDocument";
import template from "../../template";
import { DynamicObject, GenericRecord } from "../../types";
import { ErrorResponse } from "./ErrorResponse";
import { FetchCallbacks } from "./FetchCallbacks";
import { FetchRequest } from "./FetchRequest";
import { IPostedFile } from "./IPostedFile";

export const ContentType = 'Content-Type';

export const ContentTypeApplicationJson = 'application/json';

export const ContentMultipartFormData = 'multipart/form-data';

export const ContentTypeTextPlain = 'text/plain';

export default class Fetcher implements FetchCallbacks {

    onResponse?: (response: Response) => void;

    onSuccess?: () => void;

    onError?: (error: ErrorResponse) => void;

    onData?: (data: DataResponse) => void;

    constructor(callbacks: FetchCallbacks) {

        const {
            onResponse,
            onSuccess,
            onError,
            onData
        } = callbacks;

        if (onResponse !== undefined) {

            this.onResponse = onResponse.bind(this);
        }

        if (onSuccess !== undefined) {

            this.onSuccess = onSuccess.bind(this);
        }

        if (onError !== undefined) {

            this.onError = onError.bind(this);
        }

        if (onData !== undefined) {

            this.onData = onData.bind(this);
        }
    }

    async fetch(request: FetchRequest) {

        const {
            method = 'GET',
            cors,
            authProvider
        } = request;

        const url = this.buildUrl(request);

        try {

            const response = await fetch(url, {
                method,
                headers: await this.buildHeaders(request),
                body: this.buildBody(request),
                mode: cors === false ? 'same-origin' : 'cors',
                credentials: authProvider !== undefined ? 'include' : undefined
            });

            await this.processResponse(response);
        }
        catch (error: unknown) {

            this.handleError(error as ErrorResponse);
        }
    }

    /**
     * Replaces any template in the URL with the parameters of the request
     * @param request
     */
    buildUrl(request: FetchRequest): string {

        const {
            url,
            params
        } = request;

        const {
            text,
            keysNotInData
        } = template(url, params);

        // Add the parameters not found in the template to the query
        if (params !== undefined) {

            const queryParams = keysNotInData
                .map(key => `${key}=${params[key]}`)
                .join('&');

            return (text as string).indexOf('?') > -1 ? `${text}&${queryParams}` : `${text}?${queryParams}`;
        }

        return text as string;
    }

    /**
     * Builds the headers to be sent from the key-value pair headers of the configuration
     * @param request
     */
    async buildHeaders(request: FetchRequest): Promise<HeadersInit> {

        const requestHeaders = request.headers || {};

        const contentType = requestHeaders[ContentType] || ContentTypeApplicationJson;

        if (contentType === ContentMultipartFormData) {

            delete requestHeaders[ContentType];
        }

        const headers = new Headers();

        // Append the headers from the configuration
        for (const key in requestHeaders) {

            if (requestHeaders.hasOwnProperty(key)) {

                headers.append(key, requestHeaders[key]);
            }
        }

        
        // Add the authorization header
        if (request.authProvider !== undefined) {

            const authHeader = await request.authProvider.authorize();

            if (authHeader != undefined) {

                for (const key in authHeader) {

                    if (authHeader.hasOwnProperty(key)) {

                        headers.append(key, authHeader[key]);
                    }
                }
            }
        }

        return headers;
    }

    buildBody(request: FetchRequest): FormData | string | undefined {

        const {
            data,
            headers
        } = request;

        if (data === undefined) {

            return undefined;
        }

        if (typeof data === 'string') {

            return data;
        }

        const contentType = headers?.[ContentType];

        if (contentType?.startsWith(ContentTypeApplicationJson)) {

            return JSON.stringify(data);
        }

        const formData = new FormData();

        for (const key in data) {

            if (data.hasOwnProperty(key)) {

                const value = data[key] as DynamicObject;

                if (typeof value === 'object') {

                    if (value.hasOwnProperty('name')) { // Follow conventions to append a file

                        const {
                            name,
                            type,
                            content,
                            // size Not used in the File constructor
                        } = value as unknown as IPostedFile;

                        const file = new File([...content], name, {
                            type
                        });

                        formData.append(key, file);
                    }
                    else {

                        throw new Error(`Invalid form value: ${JSON.stringify(value)}`);
                    }
                }
                else {

                    formData.append(key, value);
                }
            }
        }

        return formData;
    }

    async processResponse(response: Response) {

        if (this.onResponse) {

            this.onResponse(response);
        }

        if (response.status > 299) {

            const error = {
                status: response.status,
                statusText: response.statusText,
                payload: await this.parseContent(response)
            };

            this.handleError(error);

            return;
        }

        if (response.status !== 204) { // No content

            const data: DataResponse = {
                headers: response.headers,
                payload: await this.parseContent(response)
            }
    
            if (this.onData !== undefined) {
    
                this.onData(data);
            }
        }

        if (this.onSuccess !== undefined) {
    
            this.onSuccess();
        }
  
    }

    /**
     * Converts the content to an object if possible according to the content type returned from the server
     */
    async parseContent(response: Response): Promise<GenericRecord | string> {

        let contentType: string | null = response.headers.get('content-type');

        const content = await response.text();

        if (contentType !== null) {

            contentType = contentType.split(';')[0].trim();

            switch (contentType) {
                case 'application/json': return JSON.parse(content);
                case 'application/xml': {

                    const document: Document = (new window.DOMParser()).parseFromString(content, "text/xml");

                    return deserializeXmlDocument(document);
                }
                default: return content;
            }
        }
        else { // Default to text

            return content;
        }
    }

    handleError(error: ErrorResponse) {

        if (this.onError !== undefined) {

            this.onError(error);
        }
        else {

            throw error;
        }
    }
}