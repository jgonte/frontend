import mergeStyles from "../../../custom-element/styles/mergeStyles";
import { focusableStyles } from "./Focusable.style";
export default function Focusable(Base) {
    return class FocusableMixin extends Base {
        static get styles() {
            return mergeStyles(super.styles, focusableStyles);
        }
        connectedCallback() {
            super.connectedCallback?.();
            this.tabIndex = 0;
        }
        disconnectedCallback() {
            super.disconnectedCallback?.();
            this.tabIndex = -1;
        }
    };
}
//# sourceMappingURL=Focusable.js.map