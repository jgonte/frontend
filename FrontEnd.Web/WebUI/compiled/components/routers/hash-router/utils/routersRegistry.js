const routersRegistry = new Map();
export function addRouter(name, router) {
    routersRegistry.set(name, router);
    updateRoutes();
}
export function removeRouter(name) {
    routersRegistry.delete(name);
    updateRoutes();
}
export function updateRoutes() {
    setTimeout(() => routersRegistry.forEach(r => r.route()), 0);
}
export function navigateToRoute(route, routerName = undefined) {
    const router = getRouter(routerName);
    router.rewriteHash(route);
}
function getRouter(routerName = undefined) {
    if (routerName === undefined) {
        switch (routersRegistry.size) {
            case 0: throw new Error('There are no routers registered in the registry');
            case 1:
                {
                    const iterator = routersRegistry.values();
                    return iterator.next().value;
                }
            default: throw new Error('There are more than one router registered in the registry. The name of the router is required');
        }
    }
    else {
        return routersRegistry.get(routerName);
    }
}
//# sourceMappingURL=routersRegistry.js.map