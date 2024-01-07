import defineCustomElement from "../../../custom-element/defineCustomElement";
import { DataTypes } from "../../../utils/data/DataTypes";
import Tool from "../Tool";
export const closingEvent = 'closingEvent';
export default class CloseTool extends Tool {
    constructor() {
        super();
        this.iconName = "x";
    }
    static get properties() {
        return {
            close: {
                type: DataTypes.Function,
                required: true,
                defer: true
            }
        };
    }
    handleClick(evt) {
        evt.stopPropagation();
        this.close?.();
    }
}
defineCustomElement('gcs-close-tool', CloseTool);
//# sourceMappingURL=CloseTool.js.map