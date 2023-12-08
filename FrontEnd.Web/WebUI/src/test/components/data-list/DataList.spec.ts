import DataList from "../../../components/data-list/DataList";
import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import html from "../../../rendering/html";
import { GenericRecord } from "../../../utils/types";
import clearCustomElements from "../../custom-element/helpers/clearCustomElements";
import getContentWithoutStyle from "../helpers/getContentWithoutStyle";

beforeEach(() => {

    clearCustomElements();
});

describe("Data list tests", () => {

    // it('should throw an error when the record and field attributes are not provided', () => {

    //     // Re-register the data list and its dependencies since all the custom elements are cleared before any test
    //     defineCustomElement('gcs-data-list', DataList);

    //     expect(() => {

    //         // Attach it to the DOM
    //         document.body.innerHTML = `<gcs-data-list></gcs-data-list>`;

    //     }).toThrow(new Error("The attributes: [id-field] must have a value"));
    // });

    it('should render the data', async () => {

        // Re-register the data list since all the custom elements are cleared before any test
        defineCustomElement('gcs-data-list', DataList);

        // Set up the functions to be called
        (window as unknown as GenericRecord).getData = () => [
            {
                code: 1,
                description: "Item 1"
            }
        ];

        (window as unknown as GenericRecord).getTemplate = (record: { code: number; description: string }) => html`<div key=${record.code} value=${record.code}>${record.description}</div>`;

        // Attach it to the DOM
        document.body.innerHTML = `<gcs-data-list data="getData()" item-template="getTemplate()"></gcs-data-list>`;

        // Test the element
        const component = document.querySelector('gcs-data-list') as CustomElement;

        await component.updateComplete; // Wait for the component to render

        let contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);

        expect(contentWithoutStyle).toBe("<div key=\"1\" value=\"1\"><!--_$bm_-->Item 1<!--_$em_--></div>");

        // Add another item
        component.data = [
            {
                code: 1,
                description: "Item 1"
            },
            {
                code: 2,
                description: "Item 2"
            }
        ];

        await component.updateComplete; // Wait for the component to render

        contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);

        expect(contentWithoutStyle).toBe("<div key=\"1\" value=\"1\"><!--_$bm_-->Item 1<!--_$em_--></div><div key=\"2\" value=\"2\"><!--_$bm_-->Item 2<!--_$em_--></div>");

        // Add a third one
        component.data = [
            {
                code: 1,
                description: "Item 1"
            },
            {
                code: 2,
                description: "Item 2"
            },
            {
                code: 3,
                description: "Item 3"
            }
        ];

        await component.updateComplete; // Wait for the component to render

        contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);

        expect(contentWithoutStyle).toBe("<div key=\"1\" value=\"1\"><!--_$bm_-->Item 1<!--_$em_--></div><div key=\"2\" value=\"2\"><!--_$bm_-->Item 2<!--_$em_--></div><div key=\"3\" value=\"3\"><!--_$bm_-->Item 3<!--_$em_--></div>");

        // Remove the first item
        component.data = [
            {
                code: 2,
                description: "Item 2"
            },
            {
                code: 3,
                description: "Item 3"
            }
        ];

        await component.updateComplete; // Wait for the component to render

        contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);

        expect(contentWithoutStyle).toBe("<div key=\"2\" value=\"2\"><!--_$bm_-->Item 2<!--_$em_--></div><div key=\"3\" value=\"3\"><!--_$bm_-->Item 3<!--_$em_--></div>");

    });
});