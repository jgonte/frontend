import IntlResource from "../../../utils/intl/IntlResource";

export default interface LinkGroup extends IntlResource {

    /**
     * The name of the icon to show on the group
     */
    iconName: string | undefined;

    /**
     * Whether the group is initially collapsed
     */
    collapsed: boolean;
}