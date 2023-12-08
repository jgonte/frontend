import ErrorHandler from "./errors/ErrorHandler";
import IntlProvider from "./intl/IntlProvider";

export default interface AppConfig {

    logo: string;

    title: string;
    
    errorHandler: ErrorHandler;

    intl: IntlProvider;

    iconsPath: string;

    apiUrl: string;

    useThemeSelector: boolean;

    themeNamesUrl: string;

    defaultTheme: string;
}