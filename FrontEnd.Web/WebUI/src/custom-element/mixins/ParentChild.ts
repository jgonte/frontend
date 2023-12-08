import isUndefinedOrNull from "../../utils/isUndefinedOrNull";
import isCustomElement from "../isCustomElement";
import CustomHTMLElement from "./metadata/types/CustomHTMLElement";
import CustomHTMLElementConstructor from "./metadata/types/CustomHTMLElementConstructor";

/**
 * Establishes a relationship between a parent custom element and its children to
 * allow the parent to manage them
 * @param Base 
 * @returns 
 */
export default function ParentChild<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class ParentChildMixin extends Base {

        // undefined means not initialized yet, null means it does not have any custom element as a parent
        protected adoptingParent: ParentNode | null | undefined = undefined;

        /**
         * The children elements of this one
         */
        /* protected */ adoptedChildren: Set<Node> = new Set<Node>();

        async connectedCallback(): Promise<void> {

            super.connectedCallback?.();

            this.adoptingParent = await this.findAdoptingParent() as ParentNode;

            const {
                adoptingParent
            } = this;

            if (isUndefinedOrNull(adoptingParent)) { // In slotted elements the parent is null when connected

                return;
            }

            (adoptingParent as CustomHTMLElement).adoptedChildren.add(this); // It might be null for the topmost custom element

            this.didAdoptChildCallback?.(adoptingParent as CustomHTMLElement, this);
        }

        disconnectedCallback(): void {

            super.disconnectedCallback?.();

            const {
                adoptingParent
            } = this;

            if (isUndefinedOrNull(adoptingParent)) {

                return;
            }

            this.willAbandonChildCallback?.(adoptingParent as CustomHTMLElement, this);

            (adoptingParent as ParentChildMixin).adoptedChildren.delete(this); // It might be null for the topmost custom element
        }

        async didMountCallback(): Promise<void> {

            await super.didMountCallback?.(); // Needs to wait for parent method to finish

            // Add the slotted children
            const slot = (this.document as HTMLElement).querySelector('slot');

            if (slot === null) { // There is no slot to get the children from

                const {
                    adoptingParent
                } = this;

                if (!isUndefinedOrNull(adoptingParent)) {

                    (adoptingParent as CustomHTMLElement).adoptedChildren.add(this); // It might be null for the topmost custom element

                    this.didAdoptChildCallback?.(adoptingParent as CustomHTMLElement, this);
                }

                return; // Nothing to do with the slot
            }

            const children = slot.assignedNodes();

            if (children.length > 0) { // The children have been already loaded

                children.forEach((child) => {

                    this.adoptedChildren.add(child);

                    this.didAdoptChildCallback?.(this as CustomHTMLElement, child as HTMLElement);
                });
            }
            else { // Listen for any change in the slot

                slot.addEventListener('slotchange', (this as CustomHTMLElement).handleSlotChange);
            }

            const {
                adoptedChildren
            } = this;

            if (adoptedChildren.size > 0) {

                this.didAdoptChildrenCallback?.(this, adoptedChildren);
            }
        }

        /**
         * Retrieves the parent that is a custom element up in the hierarchy
         * @returns 
         */
        protected async findAdoptingParent(): Promise<Node | null> {

            let parent = this.parentNode;

            while (parent !== null) {

                if (parent instanceof DocumentFragment) { // Possibly a shadow DOM

                    parent = (parent as ShadowRoot).host; // Get its host
                }

                const tagName = (parent as HTMLElement).tagName?.toLowerCase();

                if (tagName === 'body') { // Top parent

                    return null;
                }

                if (isCustomElement(parent as HTMLElement)) {

                    await window.customElements.whenDefined(tagName); // The parent element might not be defined yet when the child element is because the order of declaration in the bundle file
                }

                if ((parent.constructor as CustomHTMLElementConstructor).isCustomElement === true) {  // It is a custom element

                    return parent;
                }

                parent = parent.parentNode;
            }

            return null; // Got to the top without finding any parent
        }

        handleSlotchange(e: Event): void {

            console.dir(e);

            alert('kuku');
        }
    }
}