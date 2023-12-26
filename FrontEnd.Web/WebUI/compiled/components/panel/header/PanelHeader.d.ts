import CustomElement from "../../../custom-element/CustomElement";
import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
declare const PanelHeader_base: typeof CustomElement;
export default class PanelHeader extends PanelHeader_base {
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): NodePatchingData;
    renderIcon(): NodePatchingData | null;
}
export {};
