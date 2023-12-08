import Overlay from "../../../components/overlay/Overlay";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import clearCustomElements from "../../custom-element/helpers/clearCustomElements";
beforeEach(() => {
    clearCustomElements();
});
describe("Overlay tests", () => {
    it('should render empty overlay', async () => {
        defineCustomElement('gcs-overlay', Overlay);
        document.body.innerHTML = `<gcs-overlay></gcs-overlay>`;
        const component = document.querySelector('gcs-overlay');
        await component.updateComplete;
        expect(component.shadowRoot?.innerHTML).toBe("<style>\n:host {\n    position: absolute;\n    top: 0;\n    right: 0;\n    left: 0;\n    bottom: 0;\n    background-color: rgba(0, 0, 0, 0.5);\n    transition: 0.3s;\n    /* center */\n    display: flex;\n    align-items: center;\n    justify-content: center;\n}</style><slot></slot>");
    });
});
//# sourceMappingURL=Overlay.spec.js.map