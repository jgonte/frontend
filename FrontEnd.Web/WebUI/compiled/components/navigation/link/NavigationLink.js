import defineCustomElement from "../../../custom-element/defineCustomElement";
import mergeStyles from "../../../custom-element/styles/mergeStyles";
import { DataTypes } from "../../../utils/data/DataTypes";
import Clickable from "../../mixins/clickable/Clickable";
import Nuanced from "../../Nuanced";
import { navigationLinkStyles } from "./NavigationLink.styles";
export const linkClickedEvent = 'linkClickedEvent';
export default class NavigationLink extends Clickable(Nuanced) {
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