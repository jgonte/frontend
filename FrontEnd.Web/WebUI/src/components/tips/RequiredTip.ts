import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import getContentTextNode from "../../custom-element/helpers/getContentTextNode";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import Sizable from "../mixins/sizable/Sizable";
import renderTip from "./renderTip";

export default class RequiredTip extends Sizable(
    CustomElement as CustomHTMLElementConstructor
) {

    render(): NodePatchingData {

        const textNode = getContentTextNode(this);

        const content = textNode?.textContent || 'This field is required';
        
        return renderTip('danger', '*', content);
    }
}

defineCustomElement('gcs-required-tip', RequiredTip);