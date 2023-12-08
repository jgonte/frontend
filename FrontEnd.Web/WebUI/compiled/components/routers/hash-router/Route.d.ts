import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import { Constructor } from "../../../utils/types";
export type FunctionalComponent = (params: Record<string, string>) => NodePatchingData;
export type RouteView = Constructor | FunctionalComponent | string;
export default class Route {
    view?: RouteView;
    requiresAuth?: boolean;
}
