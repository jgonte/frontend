import CustomElement from "../../../../custom-element/CustomElement";
import defineCustomElement from "../../../../custom-element/defineCustomElement";
import mergeStyles from "../../../../custom-element/styles/mergeStyles";
import html from "../../../../rendering/html";
import { DataTypes } from "../../../../utils/data/DataTypes";
import { applicationHeaderStyles } from "./ApplicationHeader.styles";
export default class ApplicationHeader extends CustomElement {
    static get styles() {
        return mergeStyles(super.styles, applicationHeaderStyles);
    }
    static get properties() {
        return {
            application: {
                type: DataTypes.Object
            }
        };
    }
    render() {
        const { application } = this;
        if (application === undefined) {
            return html `<slot></slot>`;
        }
        const { type, useThemeSelector } = application;
        return html `
<gcs-nav-bar 
    router-name="app"
>
    <gcs-nav-link to="/" key="/" style="flex-wrap: nowrap;">
        ${this.renderLogo(type.logo)}
        ${this.renderTitle(type.title)}
    </gcs-nav-link>
</gcs-nav-bar>
${this.renderThemeSelector(useThemeSelector)}`;
    }
    renderLogo(logo) {
        return (logo === undefined) ?
            null :
            html `<img src=${logo} style="width: 50px;" />`;
    }
    renderTitle(title) {
        return (title === undefined) ?
            null :
            html `<h1>${title}</h1>`;
    }
    renderThemeSelector(useThemeSelector) {
        return (useThemeSelector !== true) ?
            null :
            html `<gcs-theme-selector></gcs-theme-selector>`;
    }
}
defineCustomElement('gcs-app-header', ApplicationHeader);
//# sourceMappingURL=ApplicationHeader.js.map