import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import CustomElementStateMetadata from "../../../custom-element/mixins/metadata/types/CustomElementStateMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import mergeStyles from "../../../custom-element/styles/mergeStyles";
import html from "../../../rendering/html";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import Application from "../../../services/application/Application";
import Module from "../../../services/application/type/module/Module";
import scriptsRegistry from "../../../services/application/type/module/script/scriptsRegistry";
import viewsRegistry from "../../../services/application/type/module/script/viewsRegistry";
import Route from "../../../services/application/type/route/Route";
import { GenericRecord } from "../../../utils/types";
import LoaderData from "../../loader/LoaderData";
import Loadable from "../../mixins/data/Loadable";
import Errorable from "../../mixins/errorable/Errorable";
import { applicationViewStyles } from "./ApplicationView.styles";

/**
 * Renders an application using the data received from the server
 */
export default class ApplicationView extends
    Loadable(
        Errorable(
            CustomElement as CustomHTMLElementConstructor
        )
    ) {

    static get styles(): string {

        return mergeStyles(super.styles, applicationViewStyles);
    }

    static get state(): Record<string, CustomElementStateMetadata> {

        return {

            /**
             * The application to load
             */
            application: {
                value: null
            }
        };
    }

    render(): NodePatchingData | null {

        const application = this.application as Application;

        if (application === null) {

            return html`
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

        return html`
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

    getRoutes(application: Application) {

        return application.type.routes.reduce<GenericRecord>((routes: GenericRecord, route: Route): GenericRecord => {

            routes[route.path] = {
                view: route.view // At this moment the script of the view does not seem to be loaded yet so we do that in the _getSource method
            };

            return routes;
        }, {});
    }

    getModuleLinks(application: Application) {

        return application.type.modules.reduce<GenericRecord>((links: GenericRecord, module: Module): GenericRecord => {

            const {
                name
            } = module;

            const group = {
                text: name,
                intlKey: name
            };

            application.type.routes
                .filter(route => route.module === name)
                .forEach(route => {

                    const {
                        name,
                        path
                    } = route;

                    links[path] = {
                        group,
                        text: name,
                        intlKey: name
                    };
                });

            return links;
        }, {});
    }

    async handleLoadedData(data: LoaderData) {

        const application = (data.payload || data) as unknown as Application;

        viewsRegistry.clear();

        scriptsRegistry.clear();

        const promises: Promise<unknown>[] = [];

        application.type.scripts?.forEach(s => {

            promises.push(scriptsRegistry.link(s));
        });

        application.type.modules?.forEach((m: Module) => {

            m.scripts.forEach(s => {

                promises.push(scriptsRegistry.link(s));
            });
        });

        await Promise.all(promises); // Wait for the scripts to load

        this.application = application;
    }

}

defineCustomElement('gcs-app-view', ApplicationView);
