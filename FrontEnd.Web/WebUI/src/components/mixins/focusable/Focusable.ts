import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import mergeStyles from "../../../custom-element/styles/mergeStyles";
import { focusableStyles } from "./Focusable.style";

/**
 * Mixin to make a child element focusable
 * @param Base 
 * @returns 
 */
export default function Focusable<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class FocusableMixin extends Base {

        static get styles(): string {

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
    }
}