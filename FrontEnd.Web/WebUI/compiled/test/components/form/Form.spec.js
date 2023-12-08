import TextField from "../../../components/fields/text/TextField";
import Form from "../../../components/form/Form";
import FormField from "../../../components/form/form-field/FormField";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import clearCustomElements from "../../custom-element/helpers/clearCustomElements";
import getContentWithoutStyle from "../helpers/getContentWithoutStyle";
beforeEach(() => {
    clearCustomElements();
});
describe("form tests", () => {
    it('should render a form', async () => {
        defineCustomElement('gcs-text-field', TextField);
        defineCustomElement('gcs-form-field', FormField);
        defineCustomElement('gcs-form', Form);
        document.body.innerHTML = `<gcs-form id="loadAndSubmit" load-url="http://localhost:60314/api/contacts/1"
        submit-url="http://localhost:60314/api/contacts/" label-width="65%" label-align="right" style="width: 1060px;">

        <gcs-hidden-field name="id" is-id="true"></gcs-hidden-field>

        <gcs-form-field required>
            <gcs-localized-text slot="label">Full Name</gcs-localized-text>
            <gcs-help-tip slot="tools">Here it goes the first, middle and last name of the person</gcs-help-tip>
            <gcs-text-field slot="field" name="name" value="Sarah" property-changed="displayNameTextFieldPropertyChanged()"></gcs-text-field>
        </gcs-form-field>
        
        </gcs-form>`;
        const form = document.querySelector('gcs-form');
        await form.updateComplete;
        const contentWithoutStyle = getContentWithoutStyle(form.shadowRoot?.innerHTML);
        expect(contentWithoutStyle).toBe("<form><!--_$bm_--><!--_$em_--><!--_$bm_--><!--_$em_--><!--_$bm_--><!--_$em_--><slot label-width=\"65%\" key=\"form-fields\" label-align=\"right\"></slot><!--_$bm_--><gcs-button key=\"submit-button\" kind=\"primary\" variant=\"contained\">\n           <gcs-localized-text>Submit</gcs-localized-text>\n           <gcs-icon name=\"box-arrow-right\"></gcs-icon>\n        </gcs-button><!--_$em_--></form>");
        const formField = document.querySelector('gcs-form-field');
        expect(formField.parentElement).toEqual(form);
        const textField = document.querySelector('gcs-text-field');
        expect(textField.parentElement).toEqual(formField);
    });
    it('should render a form inside a row', async () => {
        defineCustomElement('gcs-text-field', TextField);
        defineCustomElement('gcs-form-field', FormField);
        defineCustomElement('gcs-form', Form);
        document.body.innerHTML = `gcs-center>

        <gcs-form id="loadAndSubmit" load-url="http://localhost:60314/api/contacts/1"
            submit-url="http://localhost:60314/api/contacts/" label-width="65%" label-align="right" style="width: 1060px;">

            <gcs-hidden-field name="id" is-id="true"></gcs-hidden-field>

            <gcs-form-field required>
                <gcs-localized-text slot="label">Full Name</gcs-localized-text>
                <gcs-help-tip slot="tools">Here it goes the first, middle and last name of the person</gcs-help-tip>
                <gcs-text-field slot="field" name="name" value="Sarah" property-changed="displayNameTextFieldPropertyChanged()"></gcs-text-field>
            </gcs-form-field>

        </gcs-form>
        </gcs-center>`;
        const form = document.querySelector('gcs-form');
        await form.updateComplete;
        const contentWithoutStyle = getContentWithoutStyle(form.shadowRoot?.innerHTML);
        expect(contentWithoutStyle).toBe("<form><!--_$bm_--><!--_$em_--><!--_$bm_--><!--_$em_--><!--_$bm_--><!--_$em_--><slot label-width=\"65%\" key=\"form-fields\" label-align=\"right\"></slot><!--_$bm_--><gcs-button key=\"submit-button\" kind=\"primary\" variant=\"contained\">\n           <gcs-localized-text>Submit</gcs-localized-text>\n           <gcs-icon name=\"box-arrow-right\"></gcs-icon>\n        </gcs-button><!--_$em_--></form>");
        const formField = document.querySelector('gcs-form-field');
        expect(formField.parentElement).toEqual(form);
        const textField = document.querySelector('gcs-text-field');
        expect(textField.parentElement).toEqual(formField);
    });
    it('should render a form with non-default attributes set', async () => {
        defineCustomElement('gcs-text-field', TextField);
        defineCustomElement('gcs-form-field', FormField);
        defineCustomElement('gcs-form', Form);
        document.body.innerHTML = `
        <gcs-form submit-url="http://localhost:60314/api/contacts/" label-align="right" label-width="70%">
            <gcs-form-field>
                <span slot="label">Name</span>
                <gcs-text-field slot="field" id="tf2" name="name" value="Sarah"></gcs-text-field>
            </gcs-form-field>
        </gcs-form>`;
        const component = document.querySelector('gcs-form');
        await component.updateComplete;
        const contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);
        expect(contentWithoutStyle).toBe("<form><!--_$bm_--><!--_$em_--><!--_$bm_--><!--_$em_--><!--_$bm_--><!--_$em_--><slot label-width=\"70%\" key=\"form-fields\" label-align=\"right\"></slot><!--_$bm_--><gcs-button key=\"submit-button\" kind=\"primary\" variant=\"contained\">\n           <gcs-localized-text>Submit</gcs-localized-text>\n           <gcs-icon name=\"box-arrow-right\"></gcs-icon>\n        </gcs-button><!--_$em_--></form>");
    });
});
//# sourceMappingURL=Form.spec.js.map