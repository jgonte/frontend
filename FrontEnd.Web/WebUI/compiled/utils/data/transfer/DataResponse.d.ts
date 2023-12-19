import { GenericRecord } from "../../types";
export default interface DataResponse {
    headers: Headers;
    payload: GenericRecord | string;
}
