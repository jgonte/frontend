import { AuthProvider } from "../../auth/AuthProvider";
import { DynamicObject } from "../../types";

/**
 * The request passed to the fetcher
 */
 export interface FetchRequest {

    url: string;

    method?: string | undefined;

    /**
     * The headers sent to the server
     */
    headers?: Record<string, string>;

    /**
     * The data to send to the server
     */
    data?: DynamicObject | string;

    cors?: boolean;

    params?: DynamicObject;

    authProvider?: AuthProvider;
}
