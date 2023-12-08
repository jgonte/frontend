import Script from "./script/Script";

export default interface Module {

    /**
     * The name of the module
     */
    name: string;

    /**
     * The scripts this module require
     */
    scripts: Script[];
}