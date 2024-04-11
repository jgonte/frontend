import ToolBar from "../../toolbar/Toolbar";
import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
export declare const linkClickedEvent = "linkClickedEvent";
declare const NavigationLink_base: typeof ToolBar;
export default class NavigationLink extends NavigationLink_base {
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    handleClick(): void;
}
export {};
