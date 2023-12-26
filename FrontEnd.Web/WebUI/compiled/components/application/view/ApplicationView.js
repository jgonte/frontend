import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import mergeStyles from "../../../custom-element/styles/mergeStyles";
import html from "../../../rendering/html";
import scriptsRegistry from "../../../services/application/type/module/script/scriptsRegistry";
import viewsRegistry from "../../../services/application/type/module/script/viewsRegistry";
import Loadable from "../../mixins/remote-loadable/RemoteLoadable";
import { applicationViewStyles } from "./ApplicationView.styles";
export default class ApplicationView extends Loadable(CustomElement) {
    static get styles() {
        return mergeStyles(super.styles, applicationViewStyles);
    }
    static get state() {
        return {
            application: {
                value: null
            }
        };
    }
    render() {
        const { application } = this;
        if (application === null) {
            return html `
<div id="header">
    <slot name="header"></slot>
</div>
<div id="subheader">
    <slot name="subheader"></slot>
</div>
<div id="left">
    <slot name="left"></slot>
</div>
<div id="center" >
    <slot name="center"></slot>
</div>
<div id="right">
    <slot name="right"></slot>
</div>
<div id="footer"> 
    <slot name="footer"></slot>
</div>`;
        }
        const routes = this.getRoutes(application);
        const moduleLinks = this.getModuleLinks(application);
        return html `
<div id="header">
    <gcs-app-header 
        application=${application}>
    </gcs-app-header>
</div>
<div id="subheader">
    Application links go here
</div>
<div id="left">
    <gcs-nav-bar 
        router-name="app"
        orientation="vertical"
        links=${moduleLinks}>
    </gcs-nav-bar>
</div>
<div id="center">
    <gcs-hash-router 
        name="app"
        content-view-id="app-content-view" 
        routes=${routes}>
    </gcs-hash-router>
    <gcs-content-view 
        id="app-content-view" 
        style="height: 100%; overflow-y: scroll;">
    </gcs-content-view>
</div>
<div id="footer"> 
    Copyright GCS &copy;2022
</div>`;
    }
    getRoutes(application) {
        return application.type.routes.reduce((routes, route) => {
            routes[route.path] = {
                view: route.view
            };
            return routes;
        }, {});
    }
    getModuleLinks(application) {
        return application.type.modules.reduce((links, module) => {
            const { name } = module;
            const group = {
                text: name,
                intlKey: name
            };
            application.type.routes
                .filter(route => route.module === name)
                .forEach(route => {
                const { name, path } = route;
                links[path] = {
                    group,
                    text: name,
                    intlKey: name
                };
            });
            return links;
        }, {});
    }
    async handleLoadedData(data) {
        const application = (data.payload || data);
        viewsRegistry.clear();
        scriptsRegistry.clear();
        const promises = [];
        application.type.scripts?.forEach(s => {
            promises.push(scriptsRegistry.link(s));
        });
        application.type.modules?.forEach((m) => {
            m.scripts.forEach(s => {
                promises.push(scriptsRegistry.link(s));
            });
        });
        await Promise.all(promises);
        this.application = application;
    }
}
defineCustomElement('gcs-app-view', ApplicationView);
//# sourceMappingURL=ApplicationView.js.map