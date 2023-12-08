const scriptsRegistry = {
    link(script) {
        const newScript = document.createElement("script");
        newScript.setAttribute('app-script', '');
        if (script.type !== null) {
            newScript.setAttribute('type', script.type);
        }
        newScript.setAttribute('src', script.source);
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
    clear() {
        document.head.querySelectorAll('[app-script]').forEach(script => script.remove());
    }
};
export default scriptsRegistry;
//# sourceMappingURL=scriptsRegistry.js.map