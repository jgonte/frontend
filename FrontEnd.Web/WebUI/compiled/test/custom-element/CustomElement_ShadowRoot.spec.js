import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import clearCustomElements from "../../test/custom-element/helpers/clearCustomElements";
beforeEach(() => {
    clearCustomElements();
});
describe("custom element shadow root tests", () => {
    it('should create a shadow root by default', () => {
        class A extends CustomElement {
            render() {
                return null;
            }
        }
        defineCustomElement('test-a', A);
        document.body.innerHTML = '<test-a></test-a>"';
        const component = document.querySelector('test-a');
        expect(component.shadowRoot).not.toBeNull();
    });
    it('should not create a shadow root when the shadow configuration property is set to false', () => {
        class A extends CustomElement {
            static get component() {
                return {
                    shadow: false
                };
            }
            render() {
                return null;
            }
        }
        defineCustomElement('test-a', A);
        document.body.innerHTML = '<test-a></test-a>"';
        const component = document.querySelector('test-a');
        expect(component.shadowRoot).toBeNull();
    });
});
//# sourceMappingURL=CustomElement_ShadowRoot.spec.js.map