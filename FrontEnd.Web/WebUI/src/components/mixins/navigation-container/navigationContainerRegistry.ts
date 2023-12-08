import { INavigationContainer } from "./NavigationContainer";

/**
 * Tracks the navigator containers associated with the name of the router
 * This is needed to activate the link of the navigation container that matches the path of the hash fragment
 */
const navigationContainerRegistry = {

    _navigationContainers: new Map<string, Set<INavigationContainer>>(),

    add(navigationContainer: INavigationContainer) {

        const {
            routerName
        } = navigationContainer;

        const containers = this._navigationContainers.get(routerName) || new Set<INavigationContainer>();

        containers.add(navigationContainer);

        this._navigationContainers.set(routerName, containers);
    },

    delete(navigationContainer: INavigationContainer) {

        const {
            routerName
        } = navigationContainer;

        const containers = this._navigationContainers.get(routerName) || new Set<INavigationContainer>();

        containers.delete(navigationContainer);

        this._navigationContainers.set(routerName, containers);
    },

    get(routerName: string): Set<INavigationContainer> | undefined {

        return this._navigationContainers.get(routerName);
    }
};

export default navigationContainerRegistry;