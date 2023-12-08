import DataList from "../../../components/data-list/DataList";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import html from "../../../rendering/html";
import clearCustomElements from "../../custom-element/helpers/clearCustomElements";
import getContentWithoutStyle from "../helpers/getContentWithoutStyle";
beforeEach(() => {
    clearCustomElements();
});
describe("Data list tests", () => {
    it('should render the data', async () => {
        defineCustomElement('gcs-data-list', DataList);
        window.getData = () => [
            {
                code: 1,
                description: "Item 1"
            }
        ];
        window.getTemplate = (record) => html `<div key=${record.code} value=${record.code}>${record.description}</div>`;
        document.body.innerHTML = `<gcs-data-list data="getData()" item-template="getTemplate()"></gcs-data-list>`;
        const component = document.querySelector('gcs-data-list');
        await component.updateComplete;
        let contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);
        expect(contentWithoutStyle).toBe("<div key=\"1\" value=\"1\"><!--_$bm_-->Item 1<!--_$em_--></div>");
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
        await component.updateComplete;
        contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);
        expect(contentWithoutStyle).toBe("<div key=\"1\" value=\"1\"><!--_$bm_-->Item 1<!--_$em_--></div><div key=\"2\" value=\"2\"><!--_$bm_-->Item 2<!--_$em_--></div>");
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
        await component.updateComplete;
        contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);
        expect(contentWithoutStyle).toBe("<div key=\"1\" value=\"1\"><!--_$bm_-->Item 1<!--_$em_--></div><div key=\"2\" value=\"2\"><!--_$bm_-->Item 2<!--_$em_--></div><div key=\"3\" value=\"3\"><!--_$bm_-->Item 3<!--_$em_--></div>");
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
        await component.updateComplete;
        contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);
        expect(contentWithoutStyle).toBe("<div key=\"2\" value=\"2\"><!--_$bm_-->Item 2<!--_$em_--></div><div key=\"3\" value=\"3\"><!--_$bm_-->Item 3<!--_$em_--></div>");
    });
});
//# sourceMappingURL=DataList.spec.js.map