import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
declare const ModifiedTip_base: CustomHTMLElementConstructor;
export default class ModifiedTip extends ModifiedTip_base {
    render(): NodePatchingData;
}
export {};
