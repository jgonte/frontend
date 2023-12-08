import CustomElement from "../../../custom-element/CustomElement";
import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomElementStateMetadata from "../../../custom-element/mixins/metadata/types/CustomElementStateMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import { DataTypes } from "../../../utils/data/DataTypes";
import NavigationLink, { linkClickedEvent } from "../../navigation/link/NavigationLink";
import { navigateToRoute } from "../../routers/hash-router/utils/routersRegistry";
import navigationContainerRegistry from "./navigationContainerRegistry";

export interface INavigationContainer extends HTMLElement {

    routerName: string;

    setActiveLink(path: string): void;
}

/**
 * Manages the clicks of its links
 */
export default function NavigationContainer<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    /*
        Gets error:
        Class 'NavigationContainerMixin' incorrectly implements interface 'INavigationContainer'.
        Property 'routerName' is missing in type 'NavigationContainerMixin' but required in type 'INavigationContainer'.ts(2420)
        But "routerName" is already a dynamic property, therefore we disable the ts checking
     */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return class NavigationContainerMixin extends Base implements INavigationContainer {

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                /**
                 * The name of the router to route when a link is selected
                 */
                routerName: {
                    attribute: 'router-name',
                    type: DataTypes.String,
                    required: true
                },

                /**
                 * The links used by this navigation bar
                 */
                links: {
                    type: [
                        DataTypes.Object,
                        DataTypes.Function
                    ]
                }
            }
        }

        static get state(): Record<string, CustomElementStateMetadata> {

            return {

                /**
                 * To track the current selected children to send messages
                 */
                activeLink: {}
            };
        }

        // The mixin constructor requires the parameters signature to be of type any
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        constructor(...args: any[]) {

            super(args);

            this.updateActiveLink = this.updateActiveLink.bind(this);
        }

        connectedCallback(): void {

            super.connectedCallback?.();

            // routerName is not explicitly implemented in this class
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            navigationContainerRegistry.add(this);

            this.addEventListener(linkClickedEvent, this.handleLinkClicked as EventListenerOrEventListenerObject);
        }

        disconnectedCallback(): void {

            super.disconnectedCallback?.();

            // routerName is not explicitly implemented in this class
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            navigationContainerRegistry.delete(this);

            this.removeEventListener(linkClickedEvent, this.handleLinkClicked as EventListenerOrEventListenerObject);
        }

        handleLinkClicked(event: CustomEvent) {

            event.stopPropagation();

            const {
                link,
            } = event.detail;

            this.updateActiveLink(link);

            const {
                routerName
            } = this;

            navigateToRoute(link.to, routerName);
        }

        updateActiveLink(link: NavigationLink) {

            // For links we assume that only a single link can be active at a time and it cannot be deactivated unless clicking a different one
            if (link !== this.activeLink) {

                if (this.activeLink !== undefined) {

                    this.activeLink.active = false;
                }

                this.activeLink = link;
            }
        }

        setActiveLink(path: string): void {

            if (this.activeLink?.to === path) {

                return;
            }

            if (this.activeLink !== undefined) {

                this.activeLink.active = false;
            }

            this._setActiveLinkRecursively(this.adoptedChildren, path);
        }

        private _setActiveLinkRecursively(children: Set<Node>, path: string) {

            children?.forEach(ch => {

                if ((ch as NavigationLink).to === path) {

                    (ch as NavigationLink).active = true;

                    this.updateActiveLink(ch as NavigationLink);
                }
                else {

                    this._setActiveLinkRecursively((ch as CustomElement).adoptedChildren, path);
                }
            });
        }

    }
}