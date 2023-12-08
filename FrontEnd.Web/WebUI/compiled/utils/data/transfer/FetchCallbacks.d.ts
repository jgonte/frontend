import LoaderData from "../../../components/loader/LoaderData";
import { ErrorResponse } from "./ErrorResponse";
export interface FetchCallbacks {
    onResponse?: (response: Response) => void;
    onError?: (error: ErrorResponse) => void;
    onData?: (data: LoaderData) => void;
}
