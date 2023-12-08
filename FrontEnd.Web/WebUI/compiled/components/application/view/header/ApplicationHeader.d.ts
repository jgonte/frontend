import CustomElement from "../../../../custom-element/CustomElement";
import CustomElementPropertyMetadata from "../../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import { NodePatchingData } from "../../../../rendering/nodes/NodePatchingData";
export default class ApplicationHeader extends CustomElement {
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): NodePatchingData;
    renderLogo(logo: string): NodePatchingData | null;
    renderTitle(title: string): NodePatchingData | null;
    renderThemeSelector(useThemeSelector: boolean): NodePatchingData | null;
}
