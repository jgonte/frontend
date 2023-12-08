import IRenderable from "../../../../../custom-element/mixins/metadata/types/IRenderable";
import { NodePatchingData } from "../../../../../rendering/nodes/NodePatchingData";
declare const viewsRegistry: Map<string, IRenderable | (() => NodePatchingData)>;
export default viewsRegistry;
