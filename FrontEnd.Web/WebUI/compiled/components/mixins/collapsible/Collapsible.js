import mergeStyles from "../../../custom-element/styles/mergeStyles";
import { collapsibleStyles } from "./Collapsible.styles";
import { expanderChangedEvent } from "../../tools/expander/ExpanderTool";
import collapsed from "../../tools/expander/props/collapsed";
export default function Collapsible(Base) {
    return class CollapsibleMixin extends Base {
        static get styles() {
            return mergeStyles(super.styles, collapsibleStyles);
        }
        static get properties() {
            return {
                collapsed: collapsed({
                    afterUpdate: function () {
                        const cc = this.getCollapsibleContent();
                        if (this.collapsed === true) {
                            cc.style.maxHeight = '0';
                        }
                        else {
                            cc.style.maxHeight = `${cc.scrollHeight}px`;
                        }
                    }
                })
            };
        }
        connectedCallback() {
            super.connectedCallback?.();
            this.addEventListener(expanderChangedEvent, this.handleCollapsible);
        }
        disconnectedCallback() {
            super.disconnectedCallback?.();
            this.removeEventListener(expanderChangedEvent, this.handleCollapsible);
        }
        handleCollapsible(event) {
            const { collapsed } = event.detail;
            this.collapsed = collapsed;
        }
    };
}
//# sourceMappingURL=Collapsible.js.map