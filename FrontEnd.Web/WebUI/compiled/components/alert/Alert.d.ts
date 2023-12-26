import Nuanced from "../Nuanced";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
declare const Alert_base: typeof Nuanced;
export default class Alert extends Alert_base {
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): NodePatchingData;
    private _renderIcon;
    private _getIconName;
}
export {};
