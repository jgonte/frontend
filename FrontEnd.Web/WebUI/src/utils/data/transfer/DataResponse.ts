import { GenericRecord } from "../../types";

export default interface DataResponse {

    /**
     * The headers from the response
     */
    headers: Headers;

    payload: GenericRecord | string;
}