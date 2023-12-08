import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import LoaderData from "./LoaderData";
declare const Loader_base: CustomHTMLElementConstructor;
export default class Loader extends Loader_base {
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): NodePatchingData;
    didMountCallback(): void;
    handleLoadedData(data: LoaderData): void;
}
export {};
