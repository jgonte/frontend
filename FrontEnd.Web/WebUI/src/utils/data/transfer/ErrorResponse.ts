/**
 * The error response returned by the server
 */
 export interface ErrorResponse {

    status: number;

    statusText: string;

    /**
     * Extra data returned by the server in the response
     */
    payload: unknown;
}