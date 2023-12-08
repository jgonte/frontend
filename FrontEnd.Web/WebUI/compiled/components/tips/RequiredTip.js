import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import getContentTextNode from "../../custom-element/helpers/getContentTextNode";
import Sizable from "../mixins/sizable/Sizable";
import renderTip from "./renderTip";
export default class RequiredTip extends Sizable(CustomElement) {
    render() {
        const textNode = getContentTextNode(this);
        const content = textNode?.textContent || 'This field is required';
        return renderTip('danger', '*', content);
    }
}
defineCustomElement('gcs-required-tip', RequiredTip);
//# sourceMappingURL=RequiredTip.js.map