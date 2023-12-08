import DataCell from "../../../components/data-grid/body/cell/DataCell";
import DataRow from "../../../components/data-grid/body/row/DataRow";
import DataGrid from "../../../components/data-grid/DataGrid";
import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import { GenericRecord } from "../../../utils/types";
import clearCustomElements from "../../custom-element/helpers/clearCustomElements";
import getContentWithoutStyle from "../helpers/getContentWithoutStyle";


beforeEach(() => {

    clearCustomElements();
});

describe("Data grid tests", () => {

    // it('should throw an error when the record and field attributes are not provided', () => {

    //     // Re-register the data grid and its dependencies since all the custom elements are cleared before any test
    //     defineCustomElement('gcs-data-cell', DataCell);

    //     defineCustomElement('gcs-data-row', DataRow);

    //     defineCustomElement('gcs-data-grid', DataGrid);

    //     expect(() => {

    //         // Attach it to the DOM
    //         document.body.innerHTML = `<gcs-data-grid></gcs-data-grid>`;

    //     }).toThrow(new Error("The attributes: [fields, id-field] must have a value"));
    // });

    it('should render when the data of the attributes is provided', async () => {

        // Re-register the data grid since all the custom elements are cleared before any test
        defineCustomElement('gcs-data-cell', DataCell);

        defineCustomElement('gcs-data-row', DataRow);

        defineCustomElement('gcs-data-grid', DataGrid);

        // Attach it to the DOM
        document.body.innerHTML = `
        <gcs-data-grid id="dg1" id-field="name" 
            data='[{ "name": "Sarah", "age": "19", "description": "Beautiful and smart" }, { "name": "Mark", "age": "31", "description": "Hard worker" }]'
            fields='[ "name", "age", "description" ]'
        >
        </gcs-data-grid>`;

        // Test the element
        const component = document.querySelector('gcs-data-grid') as CustomElement;

        await component.updateComplete; // Wait for the component to render

        const contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);

        expect(contentWithoutStyle).toBe("<gcs-panel><!--_$bm_--><gcs-data-header slot=\"header\">\n</gcs-data-header><!--_$em_--><!--_$bm_--><gcs-data-row slot=\"body\">\n</gcs-data-row><gcs-data-row slot=\"body\">\n</gcs-data-row><!--_$em_--></gcs-panel>");
    });

    it('should render when the data of the attributes is provided via functions', async () => {

        // Set up the functions to be called
        (window as unknown as GenericRecord).getData = function () {

            return [
                {
                    name: "Sarah",
                    age: 19,
                    description: 'Smart and beautiful'
                },
                {
                    name: "Mark",
                    age: 31,
                    description: 'Hard worker'
                }
            ];
        };

        (window as unknown as GenericRecord).getFields = function () {

            return ["name", "age", "description"];
        };

        // Re-register the data grid since all the custom elements are cleared before any test
        defineCustomElement('gcs-data-cell', DataCell);

        defineCustomElement('gcs-data-row', DataRow);

        defineCustomElement('gcs-data-grid', DataGrid);

        // Attach it to the DOM
        document.body.innerHTML = '<gcs-data-grid id="dg2" id-field="name" data="getData()" fields="getFields()"></gcs-data-grid>';

        // Test the element
        const component = document.querySelector('gcs-data-grid') as CustomElement;

        await component.updateComplete; // Wait for the component to render

        const contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);

        expect(contentWithoutStyle).toBe("<gcs-panel><!--_$bm_--><gcs-data-header slot=\"header\">\n</gcs-data-header><!--_$em_--><!--_$bm_--><gcs-data-row slot=\"body\">\n</gcs-data-row><gcs-data-row slot=\"body\">\n</gcs-data-row><!--_$em_--></gcs-panel>");
    });

    it('should swap the records', async () => {

        // Set up the functions to be called
        (window as unknown as GenericRecord).getData = function () {

            return [
                {
                    name: "Sarah",
                    age: 19,
                    description: 'Smart and beautiful'
                },
                {
                    name: "Mark",
                    age: 31,
                    description: 'Hard worker'
                }
            ];
        };

        (window as unknown as GenericRecord).getFields = function () {

            return ["name", "age", "description"];
        };

        // Re-register the data grid since all the custom elements are cleared before any test
        defineCustomElement('gcs-data-cell', DataCell);

        defineCustomElement('gcs-data-row', DataRow);

        defineCustomElement('gcs-data-grid', DataGrid);

        // Attach it to the DOM
        document.body.innerHTML = '<gcs-data-grid id="dg2" id-field="name" data="getData()" fields="getFields()"></gcs-data-grid>';

        // Test the element
        const component = document.querySelector('gcs-data-grid') as CustomElement;

        await component.updateComplete; // Wait for the component to render

        let contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);

        expect(contentWithoutStyle).toBe("<gcs-panel><!--_$bm_--><gcs-data-header slot=\"header\">\n</gcs-data-header><!--_$em_--><!--_$bm_--><gcs-data-row slot=\"body\">\n</gcs-data-row><gcs-data-row slot=\"body\">\n</gcs-data-row><!--_$em_--></gcs-panel>");

        const spySetProperty = jest.spyOn(component, 'setProperty');

        const data = [
            {
                name: "Mark",
                age: 31,
                description: 'Hard worker'
            },
            {
                name: "Sarah",
                age: 19,
                description: 'Smart and beautiful'
            }
        ];

        component.data = data;

        await component.updateComplete; // Wait for the component to render

        contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);

        expect(contentWithoutStyle).toBe("<gcs-panel><!--_$bm_--><gcs-data-header slot=\"header\">\n</gcs-data-header><!--_$em_--><!--_$bm_--><gcs-data-row slot=\"body\">\n</gcs-data-row><gcs-data-row slot=\"body\">\n</gcs-data-row><!--_$em_--></gcs-panel>");

        expect(spySetProperty).toHaveBeenCalledTimes(1);

        expect(spySetProperty).toHaveBeenCalledWith('data', data);

        expect(component._properties.data).toEqual(data); // Test the data 
    });
});