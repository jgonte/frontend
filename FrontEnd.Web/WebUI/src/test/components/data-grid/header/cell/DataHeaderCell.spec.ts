import DataHeaderCell from "../../../../../components/data-grid/header/cell/DataHeaderCell";
import CustomElement from "../../../../../custom-element/CustomElement";
import defineCustomElement from "../../../../../custom-element/defineCustomElement";
import { GenericRecord } from "../../../../../utils/types";
import clearCustomElements from "../../../../custom-element/helpers/clearCustomElements";
import getContentWithoutStyle from "../../../helpers/getContentWithoutStyle";

beforeEach(() => {

    clearCustomElements();
});

describe("Data cell tests", () => {

    // it('should throw an error when the record and field attributes are not provided', () => {

    //     // Re-register the data cell since all the custom elements are cleared before any test
    //     defineCustomElement('gcs-data-header-cell', DataHeaderCell);

    //     expect(() => {

    //         // Attach it to the DOM
    //         document.body.innerHTML = `<gcs-data-header-cell></gcs-data-header-cell>`;

    //     }).toThrow(new Error("The attributes: [field] must have a value"));
    // });

    it('should render when the data of the attributes is provided', async () => {

        // Re-register the data cell since all the custom elements are cleared before any test
        defineCustomElement('gcs-data-header-cell', DataHeaderCell);

        // Attach it to the DOM
        document.body.innerHTML = '<gcs-data-header-cell id="dc1" field="name"></gcs-data-header-cell>';

        // Test the element
        const component = document.querySelector('gcs-data-header-cell') as CustomElement;

        await component.updateComplete; // Wait for the component to render

        const contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);

        expect(contentWithoutStyle).toBe("<!--_$bm_-->name<!--_$em_-->");
    });

    it('should render when the data of the attributes is provided via functions', async () => {

        // Set up the functions to be called
        (window as unknown as GenericRecord).getField = function () {

            return "name";
        };

        // Re-register the data cell since all the custom elements are cleared before any test
        defineCustomElement('gcs-data-header-cell', DataHeaderCell);

        // Attach it to the DOM
        document.body.innerHTML = '<gcs-data-header-cell id="dc2" field="getField()"></gcs-data-header-cell>';

        // Test the element
        const component = document.querySelector('gcs-data-header-cell') as CustomElement;

        await component.updateComplete; // Wait for the component to render

        const contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);

        expect(contentWithoutStyle).toBe("<!--_$bm_-->name<!--_$em_-->");
    });
});