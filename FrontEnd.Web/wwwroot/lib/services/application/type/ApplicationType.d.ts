import Module from "./module/Module";
import Script from "./module/script/Script";
import Route from "./route/Route";
export default interface ApplicationType {
    logo: string;
    title: string;
    scripts: Script[];
    modules: Module[];
    routes: Route[];
}
