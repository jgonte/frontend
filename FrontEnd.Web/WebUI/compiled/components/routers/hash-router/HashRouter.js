import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import { DataTypes } from "../../../utils/data/DataTypes";
import isClass from "../../../utils/isClass";
import { addRouter, removeRouter } from "./utils/routersRegistry";
import navigationContainerRegistry from "../../mixins/navigation-container/navigationContainerRegistry";
import viewsRegistry from "../../../services/application/type/module/script/viewsRegistry";
import getNotFoundView from "../../views/getNotFoundView";
import getHash from "./utils/getHash";
import getRewrittenHash from "./utils/getRewrittenHash";
import componentsRegistry from "../../../services/componentsRegistry";
import appCtrl from "../../../services/appCtrl";
function getParams(path, hash) {
    const [p, queryParams] = hash.split('?');
    const pathParts = path.split('/');
    const hashParts = p.split('/');
    const params = {};
    const length = pathParts.length;
    for (let i = 0; i < length; ++i) {
        const pathPart = pathParts[i];
        const hashPart = hashParts[i];
        if (pathPart === hashPart) {
            continue;
        }
        params[pathPart.substring(1)] = hashPart;
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
    _lastHash;
    static get properties() {
        return {
            name: {
                type: DataTypes.String,
                required: true
            },
            contentViewId: {
                attribute: 'content-view-id',
                type: DataTypes.String,
                required: true
            },
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
    route() {
        this._contentView = this._contentView || componentsRegistry.get(this.contentViewId);
        if (this._contentView === null) {
            throw new Error(`Cannot find content view with id: ${this.contentViewId}`);
        }
        let hash = getHash(window.location.hash, this.name);
        if (hash === this._lastHash) {
            return;
        }
        this._lastHash = hash;
        const marker = `#${this.name}`;
        hash = hash.indexOf(marker) > -1 ?
            hash.substring(marker.length) :
            hash;
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
            this._contentView.source = this._getSource(this.notFoundView, hash, hash);
            return;
        }
        const route = this.routes[path];
        if (route !== undefined) {
            setTimeout(() => {
                this._contentView.source = this._getSource(route.view, path, hash);
            }, 0);
        }
        else {
            this._contentView.source = this._getSource(this.notFoundView, path, hash);
        }
        const navContainers = navigationContainerRegistry.get(this.name);
        navContainers?.forEach(c => c.setActiveLink(path));
    }
    _routeMatches(hash, route) {
        return route === hash;
    }
    _getSource(view, path, hash) {
        const params = getParams(path, hash);
        appCtrl.routeParams = params;
        if (typeof view === 'string') {
            const v = viewsRegistry.get(view);
            if (v === undefined) {
                return view;
            }
            else {
                view = v;
            }
        }
        if (isClass(view)) {
            return new view(params);
        }
        else {
            const v = view(params);
            if (isClass(v)) {
                return new v(params);
            }
            else {
                return v;
            }
        }
    }
    rewriteHash(path) {
        window.location.hash = getRewrittenHash(window.location.hash, this.name, path);
    }
}
defineCustomElement('gcs-hash-router', HashRouter);
//# sourceMappingURL=HashRouter.js.map