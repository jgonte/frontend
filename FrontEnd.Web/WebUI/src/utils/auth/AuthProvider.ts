import { IUser } from "./IUser";

/**
 * Defines the functionality of an authentication/authorization provider
 */
export interface AuthProvider {
    /**
     * The function that does the login
     */
    login: () => void;

    /**
     * The function called when the provider did the login
     */
    onLogin: (success?: () => void) => void;

    /**
     * The function that does the logout
     */
    logout: () => void;

    /**
     * Retrieves the user data
     */
    getUser: () => Promise<IUser | null>;

    /**
     * The function that sets up the authorization header
     */
    authorize: () => Promise<Record<string, string> | undefined>;
}