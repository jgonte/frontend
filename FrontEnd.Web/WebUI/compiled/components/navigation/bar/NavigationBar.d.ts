import CustomElement from "../../../custom-element/CustomElement";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
declare const NavigationBar_base: typeof CustomElement;
export default class NavigationBar extends NavigationBar_base {
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): NodePatchingData;
    renderLinks(): NodePatchingData[];
    private renderGroupedLinks;
    private renderLink;
}
export {};
