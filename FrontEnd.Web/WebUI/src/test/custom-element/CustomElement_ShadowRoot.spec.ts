import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import clearCustomElements from "../../test/custom-element/helpers/clearCustomElements";

beforeEach(() => {

    clearCustomElements();
});

describe("custom element shadow root tests", () => {

    it('should create a shadow root by default', () => {

        class A extends CustomElement {

            render() : null {

                return null;
            }
        }

        defineCustomElement('test-a', A);

        // Attach it to the DOM
        document.body.innerHTML = '<test-a></test-a>"';

        // Test the element
        const component = document.querySelector('test-a') as CustomElement;

        expect(component.shadowRoot).not.toBeNull();
    });

    it('should not create a shadow root when the shadow configuration property is set to false', () => {

        class A extends CustomElement {

            static get component() {

                return {

                    shadow: false
                };              
            }

            render() : null {

                return null;
            }
        }

        defineCustomElement('test-a', A);

        // Attach it to the DOM
        document.body.innerHTML = '<test-a></test-a>"';

        // Test the element
        const component = document.querySelector('test-a') as CustomElement;

        expect(component.shadowRoot).toBeNull();
    });

});