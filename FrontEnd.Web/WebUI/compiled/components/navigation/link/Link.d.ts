import IntlResource from "../../../utils/intl/IntlResource";
import LinkGroup from "./LinkGroup";
export default interface Link extends IntlResource {
    path: string;
    group: LinkGroup;
}
