import { GenericRecord } from "../../utils/types";
export default interface LoaderData {
    headers: Headers;
    payload: GenericRecord | string;
}
