import { IUser } from "./IUser";
export interface AuthProvider {
    login: () => void;
    onLogin: (success?: () => void) => void;
    logout: () => void;
    getUser: () => Promise<IUser | null>;
    authorize: () => Promise<Record<string, string> | undefined>;
}
