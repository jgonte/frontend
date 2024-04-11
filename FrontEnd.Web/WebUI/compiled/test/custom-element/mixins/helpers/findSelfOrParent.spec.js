import ToolTip from "../../../../components/tooltip/ToolTip";
import Pill from "../../../../components/pill/Pill";
import LocalizedText from "../../../../components/localized-text/LocalizedText";
import RequiredTip from "../../../../components/tips/RequiredTip";
import findSelfOrParent from "../../../../custom-element/mixins/helpers/findSelfOrParent";
import clearCustomElements from "../../helpers/clearCustomElements";
import defineCustomElement from "../../../../custom-element/defineCustomElement";
beforeEach(() => {
    clearCustomElements();
});
describe("findSelfOrParent tests", () => {
    it('should output the styles for a button of primary kind', async () => {
        defineCustomElement('gcs-tool-tip', ToolTip);
        defineCustomElement('gcs-pill', Pill);
        defineCustomElement('gcs-localized-text', LocalizedText);
        defineCustomElement('gcs-required-tip', RequiredTip);
        document.body.innerHTML = '<gcs-required-tip size="large"></gcs-required-tip>';
        const parent = document.querySelector('gcs-required-tip');
        await parent.updateComplete;
        const child = parent.shadowRoot?.children[1].children[0];
        const selfOrParent = findSelfOrParent(child, p => p.constructor.name === "RequiredTip");
        expect(selfOrParent).toEqual(parent);
    });
});
//# sourceMappingURL=findSelfOrParent.spec.js.map