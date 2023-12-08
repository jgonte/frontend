import defineCustomElement from "../../../custom-element/defineCustomElement";
import clearCustomElements from "../../custom-element/helpers/clearCustomElements";
import TextField from "../../../components/fields/text/TextField";
import getContentWithoutStyle from "../helpers/getContentWithoutStyle";
beforeEach(() => {
    clearCustomElements();
});
describe("Text field tests", () => {
    it('should not render the value when it is not provided', async () => {
        defineCustomElement('gcs-text-field', TextField);
        document.body.innerHTML = '<gcs-text-field id="tf1" name="name"></gcs-text-field>';
        const component = document.querySelector('gcs-text-field');
        await component.updateComplete;
        let contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);
        expect(contentWithoutStyle).toBe("<input type=\"text\" name=\"name\"/>");
        expect(component.value).toBeUndefined();
        component.value = "Sarah";
        await component.updateComplete;
        contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);
        expect(contentWithoutStyle).toBe("<input type=\"text\" name=\"name\" value=\"Sarah\"/>");
        component.value = "Mark";
        await component.updateComplete;
        contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);
        expect(contentWithoutStyle).toBe("<input type=\"text\" name=\"name\" value=\"Mark\"/>");
    });
    it('should render the value when it is provided', async () => {
        defineCustomElement('gcs-text-field', TextField);
        document.body.innerHTML = '<gcs-text-field id="tf1" name="name" value="Sarah"></gcs-text-field>';
        const component = document.querySelector('gcs-text-field');
        await component.updateComplete;
        let contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);
        expect(contentWithoutStyle).toBe("<input type=\"text\" name=\"name\" value=\"Sarah\"/>");
        component.value = "Mark";
        await component.updateComplete;
        contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);
        expect(contentWithoutStyle).toBe("<input type=\"text\" name=\"name\" value=\"Mark\"/>");
    });
});
//# sourceMappingURL=TextField.spec.js.map