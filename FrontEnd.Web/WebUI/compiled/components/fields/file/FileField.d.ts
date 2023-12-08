import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import DisplayableField from "../DisplayableField";
export default class FileField extends DisplayableField {
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): NodePatchingData;
    openFileDialog(): void;
    renderFileList(): NodePatchingData[] | null;
}
