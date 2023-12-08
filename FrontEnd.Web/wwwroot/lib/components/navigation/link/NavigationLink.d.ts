import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import Nuanced from "../../Nuanced";
export declare const linkClickedEvent = "linkClickedEvent";
declare const NavigationLink_base: typeof Nuanced;
export default class NavigationLink extends NavigationLink_base {
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    handleClick(): void;
}
export {};
