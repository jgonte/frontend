import ToolTip from "../../../../components/tooltip/ToolTip";
import Pill from "../../../../components/pill/Pill";
import LocalizedText from "../../../../components/localized-text/LocalizedText";
import RequiredTip from "../../../../components/tips/RequiredTip";
import CustomElement from "../../../../custom-element/CustomElement";
import findSelfOrParent from "../../../../custom-element/mixins/helpers/findSelfOrParent";
import CustomHTMLElement from "../../../../custom-element/mixins/metadata/types/CustomHTMLElement";
import clearCustomElements from "../../helpers/clearCustomElements";
import defineCustomElement from "../../../../custom-element/defineCustomElement";

beforeEach(() => {

    clearCustomElements();
});

describe("findSelfOrParent tests", () => {

    it('should output the styles for a button of primary kind', async () => {

        // Re-register the form since all the custom elements are cleared before any test
        defineCustomElement('gcs-tool-tip', ToolTip);

        defineCustomElement('gcs-pill', Pill);

        defineCustomElement('gcs-localized-text', LocalizedText);

        defineCustomElement('gcs-required-tip', RequiredTip);

        // Attach it to the DOM
        document.body.innerHTML = '<gcs-required-tip size="large"></gcs-required-tip>';

        // Test the element
        const parent = document.querySelector('gcs-required-tip') as CustomElement;

        await parent.updateComplete; // Wait for the component to render

        const child = parent.shadowRoot?.children[1].children[0] as Element;

        //await childComponent.updateComplete; // The parent waits for the child to mount/update

        const selfOrParent = findSelfOrParent(
            child,
            p => (p as CustomHTMLElement).constructor.name === "RequiredTip"
        ) as CustomHTMLElement;

        expect(selfOrParent).toEqual(parent);
    });
});