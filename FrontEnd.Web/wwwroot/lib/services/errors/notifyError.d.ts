import CustomElement from "../../custom-element/CustomElement";
import { ErrorResponse } from "../../utils/data/transfer/ErrorResponse";
export type AnyError = Error | ErrorResponse | string;
export default function notifyError(element: CustomElement, error: AnyError): void;
