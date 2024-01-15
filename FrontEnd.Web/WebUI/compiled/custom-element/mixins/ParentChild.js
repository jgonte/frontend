import isUndefinedOrNull from "../../utils/isUndefinedOrNull";
import isCustomElement from "../isCustomElement";
export default function ParentChild(Base) {
    return class ParentChildMixin extends Base {
        adoptingParent = undefined;
        adoptedChildren = new Set();
        async connectedCallback() {
            super.connectedCallback?.();
            this.adoptingParent = await this._findAdoptingParent();
            const { adoptingParent } = this;
            if (isUndefinedOrNull(adoptingParent)) {
                return;
            }
            adoptingParent.adoptedChildren.add(this);
            this.didAdoptChildCallback?.(adoptingParent, this);
        }
        disconnectedCallback() {
            super.disconnectedCallback?.();
            const { adoptingParent } = this;
            if (isUndefinedOrNull(adoptingParent)) {
                return;
            }
            this.willAbandonChildCallback?.(adoptingParent, this);
            adoptingParent.adoptedChildren.delete(this);
        }
        async didMountCallback() {
            await super.didMountCallback?.();
            const slots = this.document.querySelectorAll('slot');
            if (slots.length === 0) {
                const { adoptingParent } = this;
                if (!isUndefinedOrNull(adoptingParent)) {
                    adoptingParent.adoptedChildren.add(this);
                    this.didAdoptChildCallback?.(adoptingParent, this);
                }
                return;
            }
            slots.forEach(slot => {
                const children = slot.assignedNodes();
                if (children.length > 0) {
                    children.forEach((child) => {
                        this.adoptedChildren.add(child);
                        this.parentAdoptedChildCallback?.(child);
                    });
                }
                else {
                    slot.addEventListener('slotchange', this.handleSlotChange);
                }
            });
        }
        async _findAdoptingParent() {
            let parent = this.parentNode;
            while (parent !== null) {
                if (parent instanceof DocumentFragment) {
                    parent = parent.host;
                }
                const tagName = parent.tagName?.toLowerCase();
                if (tagName === 'body') {
                    return null;
                }
                if (isCustomElement(parent)) {
                    await window.customElements.whenDefined(tagName);
                }
                if (parent.constructor.isCustomElement === true) {
                    return parent;
                }
                parent = parent.parentNode;
            }
            return null;
        }
        handleSlotchange(e) {
            console.dir(e);
            alert('kuku');
        }
        findAdoptingParent(predicate) {
            let parent = this.adoptingParent;
            while (!isUndefinedOrNull(parent)) {
                if (predicate(parent) === true) {
                    return parent;
                }
                parent = parent.adoptingParent;
            }
            return null;
        }
        findAdoptedChild(predicate) {
            const children = Array.from(this.adoptedChildren);
            for (let i = 0; i < children.length; ++i) {
                const child = children[i];
                if (predicate(child) === true) {
                    return child;
                }
                const grandChild = child?.findAdoptedChild?.(predicate);
                if (grandChild) {
                    return grandChild;
                }
            }
            return null;
        }
        findAdoptedChildById(id) {
            return this.findAdoptedChild(n => n.id === id);
        }
    };
}
//# sourceMappingURL=ParentChild.js.map