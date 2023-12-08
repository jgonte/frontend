import Module from "./module/Module";
import Script from "./module/script/Script";
import Route from "./route/Route";

export default interface ApplicationType {

    /**
     * The logo of the application type
     */
    logo: string;

    /**
     * The title of the application type
     */
    title: string;

    /**
     * The scripts of the application
     */
    scripts: Script[];

    /**
     * The modules the application is using
     */
    modules: Module[];

    /**
     * The routes the application has access to
     */
    routes: Route[];
}