import DataGridBodyCell from "../../../../../components/data-grid/body/cell/DataGridBodyCell";
import DataGridBodyRow from "../../../../../components/data-grid/body/row/DataGridBodyRow";
import defineCustomElement from "../../../../../custom-element/defineCustomElement";
import clearCustomElements from "../../../../custom-element/helpers/clearCustomElements";
import getContentWithoutStyle from "../../../helpers/getContentWithoutStyle";
beforeEach(() => {
    clearCustomElements();
});
describe("Data row tests", () => {
    it('should render when the data of the attributes is provided', async () => {
        defineCustomElement('gcs-data-cell', DataGridBodyCell);
        defineCustomElement('gcs-data-row', DataGridBodyRow);
        const fields = [
            "name",
            "age",
            "description"
        ];
        const data = {
            name: "Sarah",
            age: "19", "description": "Beautiful and smart"
        };
        document.body.innerHTML = `
        <gcs-data-row id="dr1" 
            record='${JSON.stringify(data)}'
            fields='${JSON.stringify(fields)}'
        >
        </gcs-data-row>`;
        const component = document.querySelector('gcs-data-row');
        expect(component.fields).toEqual(fields);
        expect(component.data).toEqual(data);
        await component.updateComplete;
        const contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);
        expect(contentWithoutStyle).toBe("<gcs-data-cell field=\"name\" key=\"name\"></gcs-data-cell><gcs-data-cell field=\"age\" key=\"age\"></gcs-data-cell><gcs-data-cell field=\"description\" key=\"description\"></gcs-data-cell>");
    });
    it('should render when the data of the attributes is provided via functions', async () => {
        window.getRecord = function () {
            return {
                name: "Sarah",
                age: 19,
                description: 'Smart and beautiful'
            };
        };
        window.getFields = function () {
            return ["name", "age", "description"];
        };
        defineCustomElement('gcs-data-cell', DataGridBodyCell);
        defineCustomElement('gcs-data-row', DataGridBodyRow);
        document.body.innerHTML = '<gcs-data-row id="dr2" record="getRecord()" fields="getFields()"></gcs-data-row>';
        const component = document.querySelector('gcs-data-row');
        await component.updateComplete;
        const contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);
        expect(contentWithoutStyle).toBe("<gcs-data-cell field=\"name\" key=\"name\"></gcs-data-cell><gcs-data-cell field=\"age\" key=\"age\"></gcs-data-cell><gcs-data-cell field=\"description\" key=\"description\"></gcs-data-cell>");
        const data = {
            name: "Sasha",
            age: 2,
            description: 'Little giant'
        };
        const spySetProperty = jest.spyOn(component, 'setProperty');
        component.record = data;
        expect(spySetProperty).toHaveBeenCalledTimes(1);
        expect(spySetProperty).toHaveBeenCalledWith('record', data);
        expect(component._properties.record).toEqual(data);
    });
});
//# sourceMappingURL=DataRow.spec.js.map