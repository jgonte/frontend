import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
declare const HelpTip_base: CustomHTMLElementConstructor;
export default class HelpTip extends HelpTip_base {
    render(): NodePatchingData;
}
export {};
