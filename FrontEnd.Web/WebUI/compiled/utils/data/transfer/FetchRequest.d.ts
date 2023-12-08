import { AuthProvider } from "../../auth/AuthProvider";
import { DynamicObject } from "../../types";
export interface FetchRequest {
    url: string;
    method?: string | undefined;
    headers?: Record<string, string>;
    data?: DynamicObject | string;
    cors?: boolean;
    params?: DynamicObject;
    authProvider?: AuthProvider;
}
