import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import { RenderReturnTypes } from "../../custom-element/mixins/metadata/types/IRenderable";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
declare const Panel_base: CustomHTMLElementConstructor;
export default class Panel extends Panel_base {
    static get styles(): string;
    render(): RenderReturnTypes;
    renderHeader(): NodePatchingData;
    renderBody(): NodePatchingData;
    renderFooter(): NodePatchingData;
}
export {};
