import Tool from "../Tool";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import collapsed from "./props/collapsed";

export const expanderChangedEvent = 'expanderChanged';

export default class ExpanderTool extends Tool {

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            collapsed: collapsed({
                inherit: true
            })
        };
    }

    // It is a property assignment
    iconName = () => {

        return this.collapsed === true ?
            'chevron-down' :
            'chevron-up';
    }

    handleClick(evt: Event): void {

        evt.stopPropagation();

        const collapsed = !(this.collapsed || false); // Boolean properties get removed when set to false so the value is undefined

        this.dispatchCustomEvent(expanderChangedEvent, {
            collapsed,
            element: this // To track the element in a container/manager if needed
        });

        this.collapsed = collapsed;
    }
}

defineCustomElement('gcs-expander-tool', ExpanderTool);