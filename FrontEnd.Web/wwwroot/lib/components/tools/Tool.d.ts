import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import Nuanced from "../Nuanced";
declare const Tool_base: typeof Nuanced;
export default abstract class Tool extends Tool_base {
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): NodePatchingData;
}
export {};
