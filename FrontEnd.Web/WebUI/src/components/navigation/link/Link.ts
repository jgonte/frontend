import IntlResource from "../../../utils/intl/IntlResource";
import LinkGroup from "./LinkGroup";

export default interface Link extends IntlResource {

    /**
     * The same path used by the router
     */
    path: string;

    /**
     * The group of the route
     */
    group: LinkGroup
}