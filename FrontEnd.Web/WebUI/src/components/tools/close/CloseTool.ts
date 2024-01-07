import defineCustomElement from "../../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import { DataTypes } from "../../../utils/data/DataTypes";
import Tool from "../Tool";

export const closingEvent = 'closingEvent';

export default class CloseTool extends Tool {

    constructor() {

        super();
        
        this.iconName = "x";
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * What action to execute when the tool has been closed
             */
            close: {
                type: DataTypes.Function,
                required: true,
                defer: true
            }
        };
    }

    handleClick(evt: Event) {

        evt.stopPropagation();
        
        this.close?.();
    }
}

defineCustomElement('gcs-close-tool', CloseTool);