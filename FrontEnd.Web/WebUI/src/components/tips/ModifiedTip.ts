import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import getContentTextNode from "../../custom-element/helpers/getContentTextNode";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import renderTip from "./renderTip";

export default class ModifiedTip extends CustomElement {

    render(): NodePatchingData {

        const textNode = getContentTextNode(this);

        const content = textNode?.textContent || 'This field has been modified';

        return renderTip('primary', 'M', content);
    }
}

defineCustomElement('gcs-modified-tip', ModifiedTip);
