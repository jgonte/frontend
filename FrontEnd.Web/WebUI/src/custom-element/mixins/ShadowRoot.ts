import CustomHTMLElementConstructor from "./metadata/types/CustomHTMLElementConstructor";

/**
 * Mixin to manage whether the custom component has a shadow root or not
 * @param Base 
 * @returns 
 */
export default function ShadowRoot<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class ShadowRootMixin extends Base {

        // The constructor requires the parameters signature to be of type any
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        constructor(...args: any[]) {

            super(...args);

            if ((this.constructor as CustomHTMLElementConstructor).metadata.shadow === true) {

                this.attachShadow({ mode: 'open' });
            }
        }

        /** 
         * The DOM document in which this component is updated 
         */
        get document(): HTMLElement | ShadowRoot {

            return this.shadowRoot !== null ?
                this.shadowRoot :
                this;
        }
    }
}