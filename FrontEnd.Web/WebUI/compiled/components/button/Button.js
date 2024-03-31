import defineCustomElement from "../../custom-element/defineCustomElement";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import html from "../../rendering/html";
import Disableable from "../mixins/disableable/Disableable";
import { buttonStyles } from "./Button.styles";
import { DataTypes } from "../../utils/data/DataTypes";
import Nuanced from "../Nuanced";
import Hideable from "../mixins/hideable/Hideable";
export default class Button extends Hideable(Disableable(Nuanced)) {
    static get styles() {
        return mergeStyles(super.styles, buttonStyles);
    }
    static get properties() {
        return {
            click: {
                type: DataTypes.Function,
                defer: true
            }
        };
    }
    render() {
        const { disabled, click } = this;
        return html `
<button disabled=${disabled} onClick=${click}>
    <span>
        <slot></slot>
    </span>  
</button>`;
    }
}
defineCustomElement('gcs-button', Button);
//# sourceMappingURL=Button.js.map