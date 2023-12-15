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
    ${this.renderLinks()}
</nav>`;

        }
        else {

            return html`<slot></slot>`;
        }
    }

    renderLinks(): NodePatchingData[] {

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

                lnks.push(html`
<gcs-panel>
    <gcs-localized-text slot="header">${group.text}</gcs-localized-text>
    ${this.renderGroupedLinks(groupedLinks)}
</gcs-panel>`);
            }
            else { // Push the ungrouped link

                lnks.push(this.renderLink(link));
            }
        }

        return lnks;
    }

    private renderGroupedLinks(groupedRoutes: Link[]): NodePatchingData[] {

        return groupedRoutes.map(r => this.renderLink(r, 'body'));
    }

    private renderLink(route: Link, slot: string | null = null): NodePatchingData {

        const {
            path,
            text
        } = route as Link;

        return html`
<gcs-nav-link to=${path} key=${path} slot=${slot}>
    <gcs-localized-text>${text}</gcs-localized-text>
</gcs-nav-link>`;
    }
}

defineCustomElement('gcs-nav-bar', NavigationBar);