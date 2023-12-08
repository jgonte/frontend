import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import clearCustomElements from "../../test/custom-element/helpers/clearCustomElements";
beforeEach(() => {
    clearCustomElements();
});
describe("CustomElement shadow tests", () => {
    it('should have the shadow flag true by default', () => {
        class A extends CustomElement {
            render() {
                return null;
            }
        }
        defineCustomElement('test-a', A);
        expect(A.metadata.shadow).toBe(true);
    });
    it('should have the shadow flag false when it is explicitly set', () => {
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
        expect(A.metadata.shadow).toBe(false);
    });
});
//# sourceMappingURL=CustomElement_Shadow.spec.js.map