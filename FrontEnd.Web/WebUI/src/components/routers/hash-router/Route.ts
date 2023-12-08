import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import { Constructor } from "../../../utils/types";

export type FunctionalComponent = (params: Record<string, string>) => NodePatchingData;

export type RouteView = Constructor | FunctionalComponent | string;

export default class Route {

    /**
     * The view to be rendered
     */
    view?: RouteView;

    /**
     * Whether the route requires authentication
     * If not set explicitly to false, then it is assumed to be true
     */
    requiresAuth?: boolean;
}