import clearCustomElements from "../../custom-element/helpers/clearCustomElements";
import Panel from "../../../components/panel/Panel";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import getContentWithoutStyle from "../helpers/getContentWithoutStyle";
beforeEach(() => {
    clearCustomElements();
});
describe("Panel tests", () => {
    it('should render', async () => {
        defineCustomElement('gcs-panel', Panel);
        document.body.innerHTML = `<gcs-panel>
            <span name="header">Header</span>
            <span name="body">Body</span>
            <span name="footer">Footer</span>
        </gcs-panel>`;
        const component = document.querySelector('gcs-panel');
        await component.updateComplete;
        const contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);
        expect(contentWithoutStyle).toBe("<div id=\"header\"><!--_$bm_--><slot name=\"header\"></slot><!--_$em_--></div>\n            <div id=\"body\"><!--_$bm_--><slot name=\"body\"></slot><!--_$em_--></div>\n            <div id=\"footer\"><!--_$bm_--><slot name=\"footer\"></slot><!--_$em_--></div>");
    });
});
//# sourceMappingURL=Panel.spec.js.map