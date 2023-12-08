import ApplicationType from "./type/ApplicationType";

export default interface Application {

    /**
     * The type of application that is selected by the user
     */
    type: ApplicationType;

    /**
     * Whether to use the theme selector for this application
     */
    useThemeSelector: boolean;
}