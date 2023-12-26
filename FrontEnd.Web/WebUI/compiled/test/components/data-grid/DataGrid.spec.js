import DataGridBodyCell from "../../../components/data-grid/body/cell/DataGridBodyCell";
import DataGridBodyRow from "../../../components/data-grid/body/row/DataGridBodyRow";
import DataGrid from "../../../components/data-grid/DataGrid";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import clearCustomElements from "../../custom-element/helpers/clearCustomElements";
import getContentWithoutStyle from "../helpers/getContentWithoutStyle";
beforeEach(() => {
    clearCustomElements();
});
describe("Data grid tests", () => {
    it('should render when the data of the attributes is provided', async () => {
        defineCustomElement('gcs-data-cell', DataGridBodyCell);
        defineCustomElement('gcs-data-row', DataGridBodyRow);
        defineCustomElement('gcs-data-grid', DataGrid);
        document.body.innerHTML = `
        <gcs-data-grid id="dg1" id-field="name" 
            data='[{ "name": "Sarah", "age": "19", "description": "Beautiful and smart" }, { "name": "Mark", "age": "31", "description": "Hard worker" }]'
            fields='[ "name", "age", "description" ]'
        >
        </gcs-data-grid>`;
        const component = document.querySelector('gcs-data-grid');
        await component.updateComplete;
        const contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);
        expect(contentWithoutStyle).toBe("<gcs-panel><!--_$bm_--><gcs-data-header slot=\"header\">\n</gcs-data-header><!--_$em_--><!--_$bm_--><gcs-data-row slot=\"body\">\n</gcs-data-row><gcs-data-row slot=\"body\">\n</gcs-data-row><!--_$em_--></gcs-panel>");
    });
    it('should render when the data of the attributes is provided via functions', async () => {
        window.getData = function () {
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
        window.getFields = function () {
            return ["name", "age", "description"];
        };
        defineCustomElement('gcs-data-cell', DataGridBodyCell);
        defineCustomElement('gcs-data-row', DataGridBodyRow);
        defineCustomElement('gcs-data-grid', DataGrid);
        document.body.innerHTML = '<gcs-data-grid id="dg2" id-field="name" data="getData()" fields="getFields()"></gcs-data-grid>';
        const component = document.querySelector('gcs-data-grid');
        await component.updateComplete;
        const contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);
        expect(contentWithoutStyle).toBe("<gcs-panel><!--_$bm_--><gcs-data-header slot=\"header\">\n</gcs-data-header><!--_$em_--><!--_$bm_--><gcs-data-row slot=\"body\">\n</gcs-data-row><gcs-data-row slot=\"body\">\n</gcs-data-row><!--_$em_--></gcs-panel>");
    });
    it('should swap the records', async () => {
        window.getData = function () {
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
        window.getFields = function () {
            return ["name", "age", "description"];
        };
        defineCustomElement('gcs-data-cell', DataGridBodyCell);
        defineCustomElement('gcs-data-row', DataGridBodyRow);
        defineCustomElement('gcs-data-grid', DataGrid);
        document.body.innerHTML = '<gcs-data-grid id="dg2" id-field="name" data="getData()" fields="getFields()"></gcs-data-grid>';
        const component = document.querySelector('gcs-data-grid');
        await component.updateComplete;
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
        await component.updateComplete;
        contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);
        expect(contentWithoutStyle).toBe("<gcs-panel><!--_$bm_--><gcs-data-header slot=\"header\">\n</gcs-data-header><!--_$em_--><!--_$bm_--><gcs-data-row slot=\"body\">\n</gcs-data-row><gcs-data-row slot=\"body\">\n</gcs-data-row><!--_$em_--></gcs-panel>");
        expect(spySetProperty).toHaveBeenCalledTimes(1);
        expect(spySetProperty).toHaveBeenCalledWith('data', data);
        expect(component._properties.data).toEqual(data);
    });
});
//# sourceMappingURL=DataGrid.spec.js.map