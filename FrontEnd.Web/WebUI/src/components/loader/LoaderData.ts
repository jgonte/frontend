import { GenericRecord } from "../../utils/types";

export default interface LoaderData {

    /**
     * The headers from the response
     */
    headers: Headers;

    payload: GenericRecord | string;
}