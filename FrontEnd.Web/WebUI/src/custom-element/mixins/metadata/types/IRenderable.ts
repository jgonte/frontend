import { NodePatchingData } from "../../../../rendering/nodes/NodePatchingData";

export type RenderReturnTypes = NodePatchingData | NodePatchingData[] | Promise<NodePatchingData | null> | null;

export default interface IRenderable {

    render(): RenderReturnTypes;
}