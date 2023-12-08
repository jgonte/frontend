import { Constructor } from "../../../../utils/types";
import CustomElementComponentMetadata from "./CustomElementComponentMetadata";
import CustomElementMetadata from "./CustomElementMetadata";
import CustomElementPropertyMetadata from "./CustomElementPropertyMetadata";
import CustomElementStateMetadata from "./CustomElementStateMetadata";
import CustomHTMLElement from "./CustomHTMLElement";
export default interface CustomHTMLElementConstructor extends Constructor<CustomHTMLElement> {
    isCustomElement: boolean;
    component: CustomElementComponentMetadata;
    properties: Record<string, CustomElementPropertyMetadata>;
    state: Record<string, CustomElementStateMetadata>;
    styles?: string;
    get metadata(): CustomElementMetadata;
}
