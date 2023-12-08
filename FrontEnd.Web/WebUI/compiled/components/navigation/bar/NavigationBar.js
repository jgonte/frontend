import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import mergeStyles from "../../../custom-element/styles/mergeStyles";
import html from "../../../rendering/html";
import { navigationBarStyles } from "./NavigationBar.styles";
import NavigationContainer from "../../mixins/navigation-container/NavigationContainer";
import { DataTypes } from "../../../utils/data/DataTypes";
export default class NavigationBar extends NavigationContainer(CustomElement) {
    static get styles() {
        return mergeStyles(super.styles, navigationBarStyles);
    }
    static get properties() {
        return {
            orientation: {
                type: DataTypes.String,
                options: [
                    'horizontal',
                    'vertical'
                ],
                value: 'horizontal'
            }
        };
    }
    render() {
        const { links } = this;
        if (links !== undefined) {
            return html `
<nav slot="start" class=${this.orientation}>
    ${this.renderLinks()}
</nav>`;
        }
        else {
            return html `<slot></slot>`;
        }
    }
    renderLinks() {
        const { links } = this;
        const linksArray = [];
        for (const [key, route] of Object.entries(links)) {
            linksArray.push({
                ...route,
                path: key
            });
        }
        const processedGroups = new Set();
        const lnks = [];
        const length = linksArray.length;
        for (let i = 0; i < length; ++i) {
            const link = linksArray[i];
            const { group } = link;
            if (group !== undefined) {
                if (processedGroups.has(group)) {
                    continue;
                }
                processedGroups.add(group);
                const groupedLinks = linksArray.filter(r => r.group === group);
                lnks.push(html `
<gcs-panel>
    <gcs-localized-text slot="header">${group.text}</gcs-localized-text>
    ${this.renderGroupedLinks(groupedLinks)}
</gcs-panel>`);
            }
            else {
                lnks.push(this.renderLink(link));
            }
        }
        return lnks;
    }
    renderGroupedLinks(groupedRoutes) {
        return groupedRoutes.map(r => this.renderLink(r, 'body'));
    }
    renderLink(route, slot = null) {
        const { path, text } = route;
        return html `
<gcs-nav-link to=${path} key=${path} slot=${slot}>
    <gcs-localized-text>${text}</gcs-localized-text>
</gcs-nav-link>`;
    }
}
defineCustomElement('gcs-nav-bar', NavigationBar);
//# sourceMappingURL=NavigationBar.js.map