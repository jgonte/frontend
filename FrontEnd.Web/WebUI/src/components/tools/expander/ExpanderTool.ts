import Tool from "../Tool";
import { IContentHidable } from "../../../utils/types";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import CustomElementStateMetadata from "../../../custom-element/mixins/metadata/types/CustomElementStateMetadata";

export const expanderChangedEvent = 'expanderChangedEvent';

export default class ExpanderTool 
    extends Tool 
    implements IContentHidable {

    constructor() {

        super();

        this.updateShowing = this.updateShowing.bind(this);
    }

    static get state(): Record<string, CustomElementStateMetadata> {

        return {

            showing: {
                value: false
            }
        };
    }

    // It is a property assignment
    iconName = () => {

        const {
            showing
        } = this;

        if (showing === undefined) {

            return 'chevron-down';
        }

        return showing === true ?
            'chevron-up' :
            'chevron-down';
    }

    hideContent() {

        this.updateShowing(false);
    }

    updateShowing(showing: boolean): void {

        this.showing = showing;

        this.dispatchCustomEvent(expanderChangedEvent, {
            showing,
            element: this // To track the element in a container/manager if needed
        });
    }

    handleClick(evt: Event): void {

        let {
            showing
        } = this;

        evt.stopPropagation();

        showing = !showing;

        this.updateShowing(showing);
    }
}

defineCustomElement('gcs-expander-tool', ExpanderTool);