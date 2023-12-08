import IRenderable from "../../../../../custom-element/mixins/metadata/types/IRenderable";
import { NodePatchingData } from "../../../../../rendering/nodes/NodePatchingData";

/**
 * Tracks the available views by application
 * The views are registered in the loaded scripts
 */
 const viewsRegistry = new Map<string, IRenderable | (() => NodePatchingData)>();

 export default viewsRegistry;