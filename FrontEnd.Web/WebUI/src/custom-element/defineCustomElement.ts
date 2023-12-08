import { Constructor } from "../utils/types";

export default function defineCustomElement(name: string, constructor: CustomElementConstructor | Constructor<HTMLElement>) {

    if (customElements.get(name) === undefined) {

        customElements.define(name, constructor);
    }
}