import { INavigationContainer } from "./NavigationContainer";
declare const navigationContainerRegistry: {
    _navigationContainers: Map<string, Set<INavigationContainer>>;
    add(navigationContainer: INavigationContainer): void;
    delete(navigationContainer: INavigationContainer): void;
    get(routerName: string): Set<INavigationContainer> | undefined;
};
export default navigationContainerRegistry;
