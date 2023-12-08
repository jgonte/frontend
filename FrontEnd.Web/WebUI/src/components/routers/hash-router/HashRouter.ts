import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import Route, { FunctionalComponent, RouteView } from "./Route";
import { DataTypes } from "../../../utils/data/DataTypes";
import isClass from "../../../utils/isClass";
import { Constructor } from "../../../utils/types";
import { addRouter, removeRouter } from "./utils/routersRegistry";
import navigationContainerRegistry from "../../mixins/navigation-container/navigationContainerRegistry";
import viewsRegistry from "../../../services/application/type/module/script/viewsRegistry";
import getNotFoundView from "../../views/getNotFoundView";
import getHash from "./utils/getHash";
import getRewrittenHash from "./utils/getRewrittenHash";
import componentsRegistry from "../../../services/componentsRegistry";
import appCtrl from "../../../services/appCtrl";

function getParams(path: string, hash: string): Record<string, string> {

    const [ p, queryParams] = hash.split('?');

    const pathParts = path.split('/');

    const hashParts = p.split('/');

    const params: Record<string, string> = {};

    const length = pathParts.length;

    for (let i = 0; i < length; ++i) {

        const pathPart = pathParts[i];

        const hashPart = hashParts[i];

        if (pathPart === hashPart) {

            continue; // No parameters
        }

        params[pathPart.substring(1)] = hashPart; // Remove the leading : from the parameter name
    }

    if (queryParams) {

        queryParams.split('&').forEach(param => {

            const [key, value] = param.split('=');

            params[key] = value;
        });
    }

    return params;
}


export default class HashRouter extends CustomElement {

    private _lastHash?: string; // To track whether the hash changed or not

    // private _loginPage: () => NodePatchingData = loginPage;

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The name of the router
             */
            name: {
                type: DataTypes.String,
                required: true
            },

            /**
             * The id of the content view to update the content
             */
            contentViewId: {
                attribute: 'content-view-id',
                type: DataTypes.String,
                required: true
            },

            /**
             * The routes of the router
             */
            routes: {
                type: [
                    DataTypes.Function,
                    DataTypes.Object
                ],
                value: {}
            },

            notFoundView: {
                attribute: 'not-found-view',
                type: [
                    DataTypes.Function,
                    DataTypes.String
                ],
                defer: true,
                value: getNotFoundView
            }
        };
    }

    connectedCallback() {

        super.connectedCallback?.();

        addRouter(this.name, this);
    }

    disconnectedCallback() {

        super.disconnectedCallback?.();

        removeRouter(this.name);
    }

    route(): void {

        this._contentView = this._contentView || componentsRegistry.get(this.contentViewId);

        if (this._contentView === null) {

            throw new Error(`Cannot find content view with id: ${this.contentViewId}`);
        }

        let hash = getHash(window.location.hash, this.name);

        if (hash === this._lastHash) {

            return; // It has not changed, no reason to continue
        }

        this._lastHash = hash;

        // Remove the starting # and name to get only the path
        const marker = `#${this.name}`;

        hash = hash.indexOf(marker) > -1 ?
            hash.substring(marker.length) :
            hash;

        // Remove the last slash if any
        if (hash.length > 1 &&
            hash.endsWith('/')) {

            hash = hash.slice(0, -1);
        }

        if (hash === '') {

            hash = '/';
        }

        const currentRoute = hash.split('?')[0];

        const path = Object.keys(this.routes)
            .find(r => this._routeMatches(currentRoute, r));

        if (path === undefined) {

            this._contentView.source = this._getSource(this.notFoundView, hash, hash); // Since path is undefined, pass the hash as second parameter as well

            return;
        }

        // Get the route
        const route = this.routes[path] as Route;

        if (route !== undefined) {

            // if (route.requiresAuth !== false && // Not explicitly cleared
            //     !appCtrl.user) { // There is no logged in user

            //         this._contentView.source = this._getSource(this._loginPage, path, hash);
            // }

            setTimeout(() => {

                this._contentView.source = this._getSource(route.view as RouteView, path, hash);
            }, 0); // Wait for the next refresh to load
        }
        else {

            this._contentView.source = this._getSource(this.notFoundView, path, hash);
        }

        // Set the active link of the link containers whose router name equals this
        const navContainers = navigationContainerRegistry.get(this.name);

        navContainers?.forEach(c => c.setActiveLink(path));
    }

    private _routeMatches(hash: string, route: string): boolean {

        return route === hash;
    }

    private _getSource(view: string | Constructor | FunctionalComponent, path: string, hash: string) {

        const params = getParams(path, hash);

        appCtrl.routeParams = params; // Make it available to any view that wants to use them

        if (typeof view === 'string') {

            const v = viewsRegistry.get(view);

            if (v === undefined) { // External page

                return view;
            }
            else {

                view = v as unknown as (string | Constructor | FunctionalComponent);
            }
        }

        if (isClass(view)) {

            return new (view as Constructor)(params);
        }
        else { // It should be a function

            const v = (view as FunctionalComponent)(params);

            if (isClass(v)) { // Function returning a class

                return new (v as unknown as Constructor)(params);
            }
            else {

                return v;
            }
        }
    }

    rewriteHash(path: string): void {

        window.location.hash = getRewrittenHash(window.location.hash, this.name, path);
    }
}

defineCustomElement('gcs-hash-router', HashRouter);