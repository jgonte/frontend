import defineCustomElement from "../../../custom-element/defineCustomElement";
import Tool from "../Tool";
export const expanderChanged = 'expanderChanged';
export default class ExpanderTool extends Tool {
    constructor() {
        super();
        this.updateShowing = this.updateShowing.bind(this);
    }
    static get state() {
        return {
            showing: {
                value: false
            }
        };
    }
    iconName = () => {
        const { showing } = this;
        if (showing === undefined) {
            return 'chevron-down';
        }
        return showing === true ?
            'chevron-up' :
            'chevron-down';
    };
    hideContent() {
        this.updateShowing(false);
    }
    updateShowing(showing) {
        this.showing = showing;
        this.dispatchCustomEvent(expanderChanged, {
            showing,
            element: this
        });
    }
    handleClick() {
        let { showing } = this;
        showing = !showing;
        this.updateShowing(showing);
    }
}
defineCustomElement('gcs-expander-tool', ExpanderTool);
//# sourceMappingURL=ExpanderTool.js.map