import mergeStyles from "../../../custom-element/styles/mergeStyles";
import Disableable from "../disableable/Disableable";
import Hoverable from "../hoverable/Hoverable";
import { clickableStyles } from "./Clickable.styles";
export default function Clickable(Base) {
    return class ClickableMixin extends Disableable(Hoverable(Base)) {
        static get styles() {
            return mergeStyles(super.styles, clickableStyles);
        }
        connectedCallback() {
            super.connectedCallback?.();
            this.enableEvents();
        }
        disconnectedCallback() {
            super.disconnectedCallback?.();
            this.disableEvents();
        }
        enableEvents() {
            super.enableEvents?.();
            this.addEventListener('click', this.handleClick);
        }
        disableEvents() {
            super.disableEvents?.();
            this.removeEventListener('click', this.handleClick);
        }
    };
}
//# sourceMappingURL=Clickable.js.map