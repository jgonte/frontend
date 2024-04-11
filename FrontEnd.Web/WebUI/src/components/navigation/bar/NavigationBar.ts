import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import mergeStyles from "../../../custom-element/styles/mergeStyles";
import html from "../../../rendering/html";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import Link from "../link/Link";
import IntlResource from "../../../utils/intl/IntlResource";
import { navigationBarStyles } from "./NavigationBar.styles";
import NavigationContainer from "../../mixins/navigation-container/NavigationContainer";
import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import { DataTypes } from "../../../utils/data/DataTypes";

export default class NavigationBar extends

    NavigationContainer(CustomElement) {

    static get styles(): string {

        return mergeStyles(super.styles, navigationBarStyles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The name of the router to route when a link is selected
             */
            orientation: {
                type: DataTypes.String,
                options: [
                    'horizontal',
                    'vertical'
                ],
                value: 'horizontal'
            }
        }
    }

    render(): NodePatchingData {

        const {
            links
        } = this;

        if (links !== undefined) {

            return html`
<nav slot="start" class=${this.orientation}>
    ${this._renderLinks()}
</nav>`;

        }
        else {

            return html`<slot></slot>`;
        }
    }

    private _renderLinks(): NodePatchingData[] {

        const {
            links
        } = this;

        // Convert to array adding the key to the path
        const linksArray: Link[] = [];

        for (const [key, route] of Object.entries(links)) {

            linksArray.push({
                ...(route as Link),
                path: key
            });
        }

        const processedGroups = new Set<IntlResource>();

        const lnks: NodePatchingData[] = [];

        const length = linksArray.length;

        for (let i = 0; i < length; ++i) {

            const link = linksArray[i];

            const {
                group
            } = link;

            if (group !== undefined) {

                if (processedGroups.has(group)) {

                    continue;
                }

                processedGroups.add(group);

                const groupedLinks = linksArray.filter(r => r.group === group);

                const {
                    collapsed,
                    iconName,
                    text
                } = group;

                lnks.push(html`
<gcs-panel collapsed=${collapsed}>
    <gcs-toolbar slot="header">
        ${this._renderIcon(iconName)}
        <gcs-localized-text slot="title">${text}</gcs-localized-text>
        <gcs-expander-tool slot="tools"></gcs-expander-tool>
    </gcs-toolbar>
    ${this._renderGroupedLinks(groupedLinks)}
</gcs-panel>`);
            }
            else { // Push the ungrouped link

                lnks.push(this._renderLink(link));
            }
        }

        return lnks;
    }

    private _renderIcon(iconName?: string) {

        if (iconName) {

            return html`<gcs-icon slot="icon" name=${iconName}></gcs-icon>`;
        }

        return null;
    }

    private _renderGroupedLinks(groupedRoutes: Link[]): NodePatchingData[] {

        return groupedRoutes.map(r => this._renderLink(r, 'body'));
    }

    private _renderLink(route: Link, slot: string | null = null): NodePatchingData {

        const {
            iconName,
            path,
            text
        } = route as Link;

        return html`
<gcs-nav-link to=${path} key=${path} slot=${slot}>
    ${this._renderIcon(iconName)}
    <gcs-localized-text slot="title">${text}</gcs-localized-text>
</gcs-nav-link>`;
    }
}

defineCustomElement('gcs-nav-bar', NavigationBar);