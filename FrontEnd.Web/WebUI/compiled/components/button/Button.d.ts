import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import Nuanced from "../Nuanced";
declare const Button_base: typeof Nuanced;
export default class Button extends Button_base {
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): NodePatchingData | NodePatchingData[] | null;
}
export {};
