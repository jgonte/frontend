import HashRouter from "../HashRouter";

/**
 * Tracks the routers by its name
 */
const routersRegistry = new Map<string, HashRouter>();

export function addRouter(name: string, router: HashRouter) {

    routersRegistry.set(name, router);
        
    updateRoutes();
}

export function removeRouter(name: string) {

    routersRegistry.delete(name);
        
    updateRoutes();
}

/**
 * Updates the routes
 */
export function updateRoutes() {

    setTimeout(() => routersRegistry.forEach(r => r.route()), 0);
}

/**
 * Redirects the browser to a specific route and router name
 * @param route 
 * @param routerName 
 */
 export function navigateToRoute(route: string, routerName: string | undefined = undefined) {

    const router = getRouter(routerName);

    router.rewriteHash(route);
}

function getRouter(routerName: string | undefined = undefined) : HashRouter {

    if (routerName === undefined) {

        switch(routersRegistry.size)
        {
            case 0: throw new Error('There are no routers registered in the registry');
            case 1:
                {
                    const iterator = routersRegistry.values();

                    return iterator.next().value as HashRouter;
                }
                default: throw new Error('There are more than one router registered in the registry. The name of the router is required');
        }
    }
    else {

        return routersRegistry.get(routerName) as HashRouter;
    }
}
