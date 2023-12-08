import defineCustomElement from "../../../custom-element/defineCustomElement";
import clearCustomElements from "../../custom-element/helpers/clearCustomElements";
import TextField from "../../../components/fields/text/TextField";
import CustomElement from "../../../custom-element/CustomElement";
import getContentWithoutStyle from "../helpers/getContentWithoutStyle";

beforeEach(() => {

    clearCustomElements();
});

describe("Text field tests", () => {

    // it('should throw an error when the required attributes are not provided', () => {

    //     // Re-register the data cell since all the custom elements are cleared before any test
    //     defineCustomElement('gcs-text-field', TextField);

    //     expect(() => {

    //         // Attach it to the DOM
    //         document.body.innerHTML = `<gcs-text-field></gcs-text-field>`;

    //     }).toThrow(new Error("The attributes: [name] must have a value"));
    // });

    it('should not render the value when it is not provided', async () => {

        // Re-register the data cell since all the custom elements are cleared before any test
        defineCustomElement('gcs-text-field', TextField);

        // Attach it to the DOM
        document.body.innerHTML = '<gcs-text-field id="tf1" name="name"></gcs-text-field>';

        // Test the element
        const component = document.querySelector('gcs-text-field') as CustomElement ;

        await component.updateComplete; // Wait for the component to render

        let contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);

        expect(contentWithoutStyle).toBe("<input type=\"text\" name=\"name\"/>");

        expect(component.value).toBeUndefined();

        component.value = "Sarah";

        await component.updateComplete; // Wait for the component to render

        contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);

        expect(contentWithoutStyle).toBe("<input type=\"text\" name=\"name\" value=\"Sarah\"/>");

        component.value = "Mark";

        await component.updateComplete; // Wait for the component to render

        contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);

        expect(contentWithoutStyle).toBe("<input type=\"text\" name=\"name\" value=\"Mark\"/>");
    });

    it('should render the value when it is provided', async () => {

        // Re-register the data cell since all the custom elements are cleared before any test
        defineCustomElement('gcs-text-field', TextField);

        // Attach it to the DOM
        document.body.innerHTML = '<gcs-text-field id="tf1" name="name" value="Sarah"></gcs-text-field>';

        // Test the element
        const component = document.querySelector('gcs-text-field') as CustomElement;

        await component.updateComplete; // Wait for the component to render

        let contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);

        expect(contentWithoutStyle).toBe("<input type=\"text\" name=\"name\" value=\"Sarah\"/>");

        component.value = "Mark";

        await component.updateComplete; // Wait for the component to render

        contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);

        expect(contentWithoutStyle).toBe("<input type=\"text\" name=\"name\" value=\"Mark\"/>");
    });
});