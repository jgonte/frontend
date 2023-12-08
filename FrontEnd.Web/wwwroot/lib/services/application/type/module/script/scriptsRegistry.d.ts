import Script from "./Script";
declare const scriptsRegistry: {
    link(script: Script): Promise<unknown>;
    clear(): void;
};
export default scriptsRegistry;
