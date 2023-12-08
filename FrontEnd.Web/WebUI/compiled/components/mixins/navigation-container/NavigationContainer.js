import { DataTypes } from "../../../utils/data/DataTypes";
import { linkClickedEvent } from "../../navigation/link/NavigationLink";
import { navigateToRoute } from "../../routers/hash-router/utils/routersRegistry";
import navigationContainerRegistry from "./navigationContainerRegistry";
export default function NavigationContainer(Base) {
    return class NavigationContainerMixin extends Base {
        static get properties() {
            return {
                routerName: {
                    attribute: 'router-name',
                    type: DataTypes.String,
                    required: true
                },
                links: {
                    type: [
                        DataTypes.Object,
                        DataTypes.Function
                    ]
                }
            };
        }
        static get state() {
            return {
                activeLink: {}
            };
        }
        constructor(...args) {
            super(args);
            this.updateActiveLink = this.updateActiveLink.bind(this);
        }
        connectedCallback() {
            super.connectedCallback?.();
            navigationContainerRegistry.add(this);
            this.addEventListener(linkClickedEvent, this.handleLinkClicked);
        }
        disconnectedCallback() {
            super.disconnectedCallback?.();
            navigationContainerRegistry.delete(this);
            this.removeEventListener(linkClickedEvent, this.handleLinkClicked);
        }
        handleLinkClicked(event) {
            event.stopPropagation();
            const { link, } = event.detail;
            this.updateActiveLink(link);
            const { routerName } = this;
            navigateToRoute(link.to, routerName);
        }
        updateActiveLink(link) {
            if (link !== this.activeLink) {
                if (this.activeLink !== undefined) {
                    this.activeLink.active = false;
                }
                this.activeLink = link;
            }
        }
        setActiveLink(path) {
            if (this.activeLink?.to === path) {
                return;
            }
            if (this.activeLink !== undefined) {
                this.activeLink.active = false;
            }
            this._setActiveLinkRecursively(this.adoptedChildren, path);
        }
        _setActiveLinkRecursively(children, path) {
            children?.forEach(ch => {
                if (ch.to === path) {
                    ch.active = true;
                    this.updateActiveLink(ch);
                }
                else {
                    this._setActiveLinkRecursively(ch.adoptedChildren, path);
                }
            });
        }
    };
}
//# sourceMappingURL=NavigationContainer.js.map