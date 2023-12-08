import DataHeaderCell from "../../../../../components/data-grid/header/cell/DataHeaderCell";
import defineCustomElement from "../../../../../custom-element/defineCustomElement";
import clearCustomElements from "../../../../custom-element/helpers/clearCustomElements";
import getContentWithoutStyle from "../../../helpers/getContentWithoutStyle";
beforeEach(() => {
    clearCustomElements();
});
describe("Data cell tests", () => {
    it('should render when the data of the attributes is provided', async () => {
        defineCustomElement('gcs-data-header-cell', DataHeaderCell);
        document.body.innerHTML = '<gcs-data-header-cell id="dc1" field="name"></gcs-data-header-cell>';
        const component = document.querySelector('gcs-data-header-cell');
        await component.updateComplete;
        const contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);
        expect(contentWithoutStyle).toBe("<!--_$bm_-->name<!--_$em_-->");
    });
    it('should render when the data of the attributes is provided via functions', async () => {
        window.getField = function () {
            return "name";
        };
        defineCustomElement('gcs-data-header-cell', DataHeaderCell);
        document.body.innerHTML = '<gcs-data-header-cell id="dc2" field="getField()"></gcs-data-header-cell>';
        const component = document.querySelector('gcs-data-header-cell');
        await component.updateComplete;
        const contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);
        expect(contentWithoutStyle).toBe("<!--_$bm_-->name<!--_$em_-->");
    });
});
//# sourceMappingURL=DataHeaderCell.spec.js.map