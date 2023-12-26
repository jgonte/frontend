import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import getContentTextNode from "../../custom-element/helpers/getContentTextNode";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import renderTip from "./renderTip";

export default class HelpTip extends CustomElement {

    render(): NodePatchingData {

        const textNode = getContentTextNode(this);

        const content = textNode?.textContent || 'Help content not set';

        return renderTip('secondary', '?', content);
    }
}

defineCustomElement('gcs-help-tip', HelpTip);
