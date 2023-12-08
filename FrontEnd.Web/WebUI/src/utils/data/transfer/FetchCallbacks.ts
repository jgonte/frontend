import LoaderData from "../../../components/loader/LoaderData";
import { ErrorResponse } from "./ErrorResponse";

/**
 * Callbacks to be implemented in order to handle the different fetch scenarios
 */
 export interface FetchCallbacks {

    onResponse?: (response: Response) => void;

    onError?: (error: ErrorResponse) => void;

    onData?: (data: LoaderData) => void;
}