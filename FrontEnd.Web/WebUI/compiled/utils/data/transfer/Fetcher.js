import deserializeXmlDocument from "../../deserializeXmlDocument";
import template from "../../template";
export const ContentType = 'Content-Type';
export const ContentTypeApplicationJson = 'application/json';
export const ContentMultipartFormData = 'multipart/form-data';
export const ContentTypeTextPlain = 'text/plain';
export default class Fetcher {
    onResponse;
    onError;
    onData;
    contentType;
    constructor(callbacks) {
        const { onResponse, onError, onData } = callbacks;
        if (onResponse !== undefined) {
            this.onResponse = onResponse.bind(this);
        }
        if (onError !== undefined) {
            this.onError = onError.bind(this);
        }
        if (onData !== undefined) {
            this.onData = onData.bind(this);
        }
    }
    async fetch(request) {
        const { method = 'GET', cors, authProvider } = request;
        const url = this.buildUrl(request);
        try {
            const response = await fetch(url, {
                method,
                headers: await this.buildHeaders(request),
                body: this.buildBody(request),
                mode: cors === false ? 'same-origin' : 'cors',
                credentials: authProvider !== undefined ? 'include' : undefined
            });
            if (response.status != 204) {
                return await this.processResponse(response);
            }
        }
        catch (error) {
            this.handleError(error);
        }
        return null;
    }
    buildUrl(request) {
        const { url, params } = request;
        const { text, keysNotInData } = template(url, params);
        if (params !== undefined) {
            const queryParams = keysNotInData
                .map(key => `${key}=${params[key]}`)
                .join('&');
            return text.indexOf('?') > -1 ? `${text}&${queryParams}` : `${text}?${queryParams}`;
        }
        return text;
    }
    async buildHeaders(request) {
        const requestHeaders = request.headers || {};
        this.contentType = this.contentType || ContentTypeApplicationJson;
        if (requestHeaders[ContentType] === undefined) {
            requestHeaders[ContentType] = this.contentType;
        }
        const headers = new Headers();
        for (const key in requestHeaders) {
            if (requestHeaders.hasOwnProperty(key)) {
                headers.append(key, requestHeaders[key]);
            }
        }
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
    buildBody(request) {
        const { data } = request;
        if (data === undefined) {
            return undefined;
        }
        if (typeof data === 'string') {
            return data;
        }
        if (this.contentType?.startsWith(ContentTypeApplicationJson)) {
            return JSON.stringify(data);
        }
        const formData = new FormData();
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const value = data[key];
                if (typeof value === 'object') {
                    if (value.hasOwnProperty('name')) {
                        const { name, type, content, } = value;
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
    async processResponse(response) {
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
        const data = {
            headers: response.headers,
            payload: await this.parseContent(response)
        };
        if (this.onData !== undefined) {
            this.onData(data);
        }
        return data;
    }
    async parseContent(response) {
        let contentType = response.headers.get('content-type');
        const content = await response.text();
        if (contentType !== null) {
            contentType = contentType.split(';')[0].trim();
            switch (contentType) {
                case 'application/json': return JSON.parse(content);
                case 'application/xml': {
                    const document = (new window.DOMParser()).parseFromString(content, "text/xml");
                    return deserializeXmlDocument(document);
                }
                default: return content;
            }
        }
        else {
            return content;
        }
    }
    handleError(error) {
        if (this.onError !== undefined) {
            this.onError(error);
        }
        else {
            throw error;
        }
    }
}
//# sourceMappingURL=Fetcher.js.map