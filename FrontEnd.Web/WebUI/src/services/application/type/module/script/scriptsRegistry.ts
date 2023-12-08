import Script from "./Script";

/**
 * Tracks the linked scripts per application
 */
const scriptsRegistry = {

    /**
     * Creates an external script node in the document
     * @param script The information of the script to link
     */
    link(script: Script) {

        const newScript = document.createElement("script");

        // Set the attribute so we can remove it when the scripts of other application are loaded
        newScript.setAttribute('app-script', '');

        if (script.type !== null) {

            newScript.setAttribute('type', script.type);
        }

        newScript.setAttribute('src', script.source);

        // Promise to wait on the script to load
        const promise = new Promise((resolve, reject) => {

            newScript.onload = () => {

                console.log(`Script: ${script.source} has been loaded`);

                resolve(undefined);
            };

            newScript.onerror = () => {

                reject(`Error loading script at ${script.source}`);
            };

        });

        document.head.appendChild(newScript);

        return promise;
    },

    /**
     * Clears all the linked script nodes 
     */
    clear() {

        document.head.querySelectorAll('[app-script]').forEach(script => script.remove());
    }
};

export default scriptsRegistry;