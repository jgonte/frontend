import Tool from "../Tool";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import collapsed from "./props/collapsed";
export const expanderChangedEvent = 'expanderChanged';
export default class ExpanderTool extends Tool {
    static get properties() {
        return {
            collapsed: collapsed({
                inherit: true
            })
        };
    }
    iconName = () => {
        return this.collapsed === true ?
            'chevron-down' :
            'chevron-up';
    };
    handleClick(evt) {
        evt.stopPropagation();
        const collapsed = !(this.collapsed || false);
        this.dispatchCustomEvent(expanderChangedEvent, {
            collapsed,
            element: this
        });
        this.collapsed = collapsed;
    }
}
defineCustomElement('gcs-expander-tool', ExpanderTool);
//# sourceMappingURL=ExpanderTool.js.map