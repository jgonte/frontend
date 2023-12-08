import clearCustomElements from "../../custom-element/helpers/clearCustomElements";
import Panel from "../../../components/panel/Panel";
import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import getContentWithoutStyle from "../helpers/getContentWithoutStyle";

beforeEach(() => {

    clearCustomElements();
});

describe("Panel tests", () => {

    it('should render', async () => {

        // Re-register the panel since all the custom elements are cleared before any test
        defineCustomElement('gcs-panel', Panel);

        // Attach it to the DOM
        document.body.innerHTML = `<gcs-panel>
            <span name="header">Header</span>
            <span name="body">Body</span>
            <span name="footer">Footer</span>
        </gcs-panel>`;

        // Test the element
        const component = document.querySelector('gcs-panel') as CustomElement;

        await component.updateComplete; // Wait for the component to render

        const contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);

        expect(contentWithoutStyle).toBe("<div id=\"header\"><!--_$bm_--><slot name=\"header\"></slot><!--_$em_--></div>\n            <div id=\"body\"><!--_$bm_--><slot name=\"body\"></slot><!--_$em_--></div>\n            <div id=\"footer\"><!--_$bm_--><slot name=\"footer\"></slot><!--_$em_--></div>");

    });

});