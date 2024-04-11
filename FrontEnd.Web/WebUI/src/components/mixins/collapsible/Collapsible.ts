import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import mergeStyles from "../../../custom-element/styles/mergeStyles";
import { collapsibleStyles } from "./Collapsible.styles";
import { expanderChangedEvent } from "../../tools/expander/ExpanderTool";
import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import collapsed from "../../tools/expander/props/collapsed";

export default function Collapsible<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class CollapsibleMixin extends Base
    {
        static get styles(): string {

            return mergeStyles(super.styles, collapsibleStyles);
        }

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {
    
                /**
                 * Whether the content has been collapsed
                 */
                collapsed: collapsed({
                    afterUpdate: function () {
    
                        const cc = (this as unknown as CollapsibleMixin).getCollapsibleContent();
    
                        if ((this as unknown as CollapsibleMixin).collapsed === true) {
    
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
    
            this.addEventListener(expanderChangedEvent, this.handleCollapsible as EventListenerOrEventListenerObject);
    
        }
    
        disconnectedCallback() {
    
            super.disconnectedCallback?.();
    
            this.removeEventListener(expanderChangedEvent, this.handleCollapsible as EventListenerOrEventListenerObject);
        }

        handleCollapsible(event: CustomEvent): void {

            const {
                collapsed
            } = event.detail;

            this.collapsed = collapsed;
        }

        // Abstract
        // getCollapsibleContent() : HTMLElement
    }
}

