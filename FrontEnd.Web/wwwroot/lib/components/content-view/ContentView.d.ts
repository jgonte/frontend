import CustomElement from "../../custom-element/CustomElement";
import CustomElementComponentMetadata from "../../custom-element/mixins/metadata/types/CustomElementComponentMetadata";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
export default class ContentView extends CustomElement {
    static get component(): CustomElementComponentMetadata;
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
}
