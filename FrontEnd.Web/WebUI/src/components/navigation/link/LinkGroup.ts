import IntlResource from "../../../utils/intl/IntlResource";

export default interface LinkGroup extends IntlResource {

    /**
     * Whether the group can be either collapsed or expanded
     */
    collapsible: boolean;

    /**
     * Whether the group is initially collapsed
     */
    collapsed: boolean;
}