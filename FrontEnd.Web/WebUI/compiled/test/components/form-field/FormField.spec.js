import TextField from "../../../components/fields/text/TextField";
import FormField from "../../../components/form/form-field/FormField";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import clearCustomElements from "../../custom-element/helpers/clearCustomElements";
import getContentWithoutStyle from "../helpers/getContentWithoutStyle";
beforeEach(() => {
    clearCustomElements();
});
describe("form tests", () => {
    it('should render a form field', async () => {
        defineCustomElement('gcs-text-field', TextField);
        defineCustomElement('gcs-form-field', FormField);
        document.body.innerHTML = `<gcs-form-field>
            <span slot="label">Name</span>
            <gcs-text-field slot="field" name="name"></gcs-text-field>
        </gcs-form-field>`;
        const component = document.querySelector('gcs-form-field');
        await component.updateComplete;
        const contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);
        expect(contentWithoutStyle).toBe("<div id=\"labeled-field\">\n    <span id=\"label-container\" style=\"width: 50%;\">\n        <span id=\"label\" style=\"text-align: left;\">\n            <slot name=\"label\"></slot>\n        </span> \n        <span id=\"tools\">\n            <slot name=\"tools\" id=\"tools-slot\">        \n            </slot><!--_$bm_--><!--_$em_--><span id=\"colon-span\">:</span>\n        </span>\n    </span>\n    <span id=\"field\">\n        <slot name=\"field\"></slot><!--_$bm_--><!--_$em_--></span>\n</div>      \n<gcs-validation-summary>\n</gcs-validation-summary>");
    });
});
//# sourceMappingURL=FormField.spec.js.map