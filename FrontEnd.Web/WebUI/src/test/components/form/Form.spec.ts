import TextField from "../../../components/fields/text/TextField";
import Form from "../../../components/form/Form";
import FormField from "../../../components/form/form-field/FormField";
import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import clearCustomElements from "../../custom-element/helpers/clearCustomElements";
import getContentWithoutStyle from "../helpers/getContentWithoutStyle";

beforeEach(() => {

    clearCustomElements();
});

describe("form tests", () => {

    // it('should throw an error when the submit url is not provided', () => {

    //     // Re-register the form and its dependencies since all the custom elements are cleared before any test
    //     defineCustomElement('gcs-form', Form);

    //     expect(() => {

    //         // Attach it to the DOM
    //         document.body.innerHTML = `<gcs-form></gcs-form>`;

    //     }).toThrow(new Error("The attributes: [submit-url] must have a value"));
    // });

    it('should render a form', async () => {

        // Re-register the form since all the custom elements are cleared before any test
        defineCustomElement('gcs-text-field', TextField);

        defineCustomElement('gcs-form-field', FormField);

        defineCustomElement('gcs-form', Form);

        // Attach it to the DOM
        document.body.innerHTML = `<gcs-form id="loadAndSubmit" load-url="http://localhost:60314/api/contacts/1"
        submit-url="http://localhost:60314/api/contacts/" label-width="65%" label-align="right" style="width: 1060px;">

        <gcs-hidden-field name="id" is-id="true"></gcs-hidden-field>

        <gcs-form-field required>
            <gcs-localized-text slot="label">Full Name</gcs-localized-text>
            <gcs-help-tip slot="tools">Here it goes the first, middle and last name of the person</gcs-help-tip>
            <gcs-text-field slot="field" name="name" value="Sarah" property-changed="displayNameTextFieldPropertyChanged()"></gcs-text-field>
        </gcs-form-field>
        
        </gcs-form>`;

        // Test the element
        const form = document.querySelector('gcs-form') as CustomElement;

        await form.updateComplete; // Wait for the component to render

        const contentWithoutStyle = getContentWithoutStyle(form.shadowRoot?.innerHTML);

        expect(contentWithoutStyle).toBe("<form><!--_$bm_--><!--_$em_--><!--_$bm_--><!--_$em_--><!--_$bm_--><!--_$em_--><slot label-width=\"65%\" key=\"form-fields\" label-align=\"right\"></slot><!--_$bm_--><gcs-button key=\"submit-button\" kind=\"primary\" variant=\"contained\">\n           <gcs-localized-text>Submit</gcs-localized-text>\n           <gcs-icon name=\"box-arrow-right\"></gcs-icon>\n        </gcs-button><!--_$em_--></form>");

        const formField = document.querySelector('gcs-form-field') as CustomElement;

        expect(formField.parentElement).toEqual(form);

        const textField = document.querySelector('gcs-text-field') as CustomElement;

        expect(textField.parentElement).toEqual(formField);
    });

    it('should render a form inside a row', async () => {

        // Re-register the form since all the custom elements are cleared before any test
        defineCustomElement('gcs-text-field', TextField);

        defineCustomElement('gcs-form-field', FormField);

        defineCustomElement('gcs-form', Form);

        // Attach it to the DOM
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

        // Test the element
        const form = document.querySelector('gcs-form') as CustomElement;

        await form.updateComplete; // Wait for the component to render

        const contentWithoutStyle = getContentWithoutStyle(form.shadowRoot?.innerHTML);

        expect(contentWithoutStyle).toBe("<form><!--_$bm_--><!--_$em_--><!--_$bm_--><!--_$em_--><!--_$bm_--><!--_$em_--><slot label-width=\"65%\" key=\"form-fields\" label-align=\"right\"></slot><!--_$bm_--><gcs-button key=\"submit-button\" kind=\"primary\" variant=\"contained\">\n           <gcs-localized-text>Submit</gcs-localized-text>\n           <gcs-icon name=\"box-arrow-right\"></gcs-icon>\n        </gcs-button><!--_$em_--></form>");

        const formField = document.querySelector('gcs-form-field') as CustomElement;

        expect(formField.parentElement).toEqual(form);

        const textField = document.querySelector('gcs-text-field') as CustomElement;

        expect(textField.parentElement).toEqual(formField);
    });

    it('should render a form with non-default attributes set', async () => {

        // Re-register the form since all the custom elements are cleared before any test
        defineCustomElement('gcs-text-field', TextField);

        defineCustomElement('gcs-form-field', FormField);

        defineCustomElement('gcs-form', Form);

        // Attach it to the DOM
        document.body.innerHTML = `
        <gcs-form submit-url="http://localhost:60314/api/contacts/" label-align="right" label-width="70%">
            <gcs-form-field>
                <span slot="label">Name</span>
                <gcs-text-field slot="field" id="tf2" name="name" value="Sarah"></gcs-text-field>
            </gcs-form-field>
        </gcs-form>`;

        // Test the element
        const component = document.querySelector('gcs-form') as CustomElement;

        await component.updateComplete; // Wait for the component to render

        const contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);

        expect(contentWithoutStyle).toBe("<form><!--_$bm_--><!--_$em_--><!--_$bm_--><!--_$em_--><!--_$bm_--><!--_$em_--><slot label-width=\"70%\" key=\"form-fields\" label-align=\"right\"></slot><!--_$bm_--><gcs-button key=\"submit-button\" kind=\"primary\" variant=\"contained\">\n           <gcs-localized-text>Submit</gcs-localized-text>\n           <gcs-icon name=\"box-arrow-right\"></gcs-icon>\n        </gcs-button><!--_$em_--></form>");
    });

    // it('should render when the data of the attributes is provided via functions', async () => {

    //     // Set up the functions to be called
    //     (window as unknown as GenericRecord).getData = function () {

    //         return [
    //             {
    //                 name: "Sarah",
    //                 age: 19,
    //                 description: 'Smart and beautiful'
    //             },
    //             {
    //                 name: "Mark",
    //                 age: 31,
    //                 description: 'Hard worker'
    //             }
    //         ];
    //     };

    //     (window as unknown as GenericRecord).getFields = function () {

    //         return ["name", "age", "description"];
    //     };

    //     // Re-register the form since all the custom elements are cleared before any test
    //     defineCustomElement('gcs-data-cell', DataCell);

    //     defineCustomElement('gcs-data-row', DataRow);

    //     defineCustomElement('gcs-data-grid', DataGrid);

    //     // Attach it to the DOM
    //     document.body.innerHTML = '<gcs-data-grid id="dg2" data="getData()" fields="getFields()"></gcs-data-grid>';

    //     // Test the element
    //     const component: any = document.querySelector('gcs-data-grid');

    //     await component.updateComplete; // Wait for the component to render

    //     expect(component.shadowRoot.innerHTML).toBe(`<gcs-data-header fields=\"[&#x22;name&#x22;,&#x22;age&#x22;,&#x22;description&#x22;]\"></gcs-data-header><!----><gcs-data-row fields=\"[&#x22;name&#x22;,&#x22;age&#x22;,&#x22;description&#x22;]\" record=\"{&#x22;name&#x22;:&#x22;Sarah&#x22;,&#x22;age&#x22;:19,&#x22;description&#x22;:&#x22;Smart and beautiful&#x22;}\" key=\"tbd\"></gcs-data-row><!----><gcs-data-row fields=\"[&#x22;name&#x22;,&#x22;age&#x22;,&#x22;description&#x22;]\" record=\"{&#x22;name&#x22;:&#x22;Mark&#x22;,&#x22;age&#x22;:31,&#x22;description&#x22;:&#x22;Hard worker&#x22;}\" key=\"tbd\"></gcs-data-row><!----><style>[object Object]</style>`);
    // });
});