import Clickable from "../../mixins/clickable/Clickable";
import ToolBar from "../../toolbar/Toolbar";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import mergeStyles from "../../../custom-element/styles/mergeStyles";
import { DataTypes } from "../../../utils/data/DataTypes";
import { navigationLinkStyles } from "./NavigationLink.styles";
export const linkClickedEvent = 'linkClickedEvent';
export default class NavigationLink extends Clickable(ToolBar) {
    static get styles() {
        return mergeStyles(super.styles, navigationLinkStyles);
    }
    static get properties() {
        return {
            to: {
                type: DataTypes.String,
                required: true
            },
            active: {
                type: DataTypes.Boolean,
                reflect: true
            }
        };
    }
    handleClick() {
        this.active = true;
        this.dispatchCustomEvent(linkClickedEvent, {
            link: this
        });
    }
}
defineCustomElement('gcs-nav-link', NavigationLink);
//# sourceMappingURL=NavigationLink.js.map