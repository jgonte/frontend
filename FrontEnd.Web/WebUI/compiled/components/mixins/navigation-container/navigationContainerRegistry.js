const navigationContainerRegistry = {
    _navigationContainers: new Map(),
    add(navigationContainer) {
        const { routerName } = navigationContainer;
        const containers = this._navigationContainers.get(routerName) || new Set();
        containers.add(navigationContainer);
        this._navigationContainers.set(routerName, containers);
    },
    delete(navigationContainer) {
        const { routerName } = navigationContainer;
        const containers = this._navigationContainers.get(routerName) || new Set();
        containers.delete(navigationContainer);
        this._navigationContainers.set(routerName, containers);
    },
    get(routerName) {
        return this._navigationContainers.get(routerName);
    }
};
export default navigationContainerRegistry;
//# sourceMappingURL=navigationContainerRegistry.js.map