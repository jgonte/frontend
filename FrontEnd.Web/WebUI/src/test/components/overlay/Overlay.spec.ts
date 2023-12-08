import Overlay from "../../../components/overlay/Overlay";
import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import clearCustomElements from "../../custom-element/helpers/clearCustomElements";

beforeEach(() => {

    clearCustomElements();
});

describe("Overlay tests", () => {

    it('should render empty overlay', async () => {

        // Re-register the data grid since all the custom elements are cleared before any test
        defineCustomElement('gcs-overlay', Overlay);

        // Attach it to the DOM
        document.body.innerHTML = `<gcs-overlay></gcs-overlay>`;

        // Test the element
        const component = document.querySelector('gcs-overlay') as CustomElement;

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot?.innerHTML).toBe("<style>\n:host {\n    position: absolute;\n    top: 0;\n    right: 0;\n    left: 0;\n    bottom: 0;\n    background-color: rgba(0, 0, 0, 0.5);\n    transition: 0.3s;\n    /* center */\n    display: flex;\n    align-items: center;\n    justify-content: center;\n}</style><slot></slot>");
    });

});