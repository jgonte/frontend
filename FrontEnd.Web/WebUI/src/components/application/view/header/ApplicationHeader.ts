import CustomElement from "../../../../custom-element/CustomElement";
import defineCustomElement from "../../../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import mergeStyles from "../../../../custom-element/styles/mergeStyles";
import html from "../../../../rendering/html";
import { NodePatchingData } from "../../../../rendering/nodes/NodePatchingData";
import Application from "../../../../services/application/Application";
import { DataTypes } from "../../../../utils/data/DataTypes";
import { applicationHeaderStyles } from "./ApplicationHeader.styles";

export default class ApplicationHeader extends CustomElement {

    static get styles(): string {

        return mergeStyles(super.styles, applicationHeaderStyles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The application to render the header for
             */
            application: {
                type: DataTypes.Object
                //required: true - It might be configured through children
            }
        };
    }

    render(): NodePatchingData {

        const {
            application
        } = this;

        if (application === undefined) {

            return html`<slot></slot>`;
        }

        const {
            type,
            useThemeSelector
        } = application as Application;

        return html`
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

    renderLogo(logo: string): NodePatchingData | null {

        return (logo === undefined) ?
            null :
            html`<img src=${logo} style="width: 50px;" />`;
    }

    renderTitle(title: string): NodePatchingData | null {

        return (title === undefined) ?
            null :
            html`<h1>${title}</h1>`;
    }

    renderThemeSelector(useThemeSelector: boolean): NodePatchingData | null {

        return (useThemeSelector !== true) ?
            null :
            html`<gcs-theme-selector></gcs-theme-selector>`;
    }
}

defineCustomElement('gcs-app-header', ApplicationHeader);