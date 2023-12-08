import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import getContentTextNode from "../../custom-element/helpers/getContentTextNode";
import Sizable from "../mixins/sizable/Sizable";
import renderTip from "./renderTip";
export default class HelpTip extends Sizable(CustomElement) {
    render() {
        const textNode = getContentTextNode(this);
        const content = textNode?.textContent || 'Help content not set';
        return renderTip('secondary', '?', content);
    }
}
defineCustomElement('gcs-help-tip', HelpTip);
//# sourceMappingURL=HelpTip.js.map