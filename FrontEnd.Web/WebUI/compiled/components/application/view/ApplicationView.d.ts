import CustomElementStateMetadata from "../../../custom-element/mixins/metadata/types/CustomElementStateMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import Application from "../../../services/application/Application";
import { GenericRecord } from "../../../utils/types";
import DataResponse from "../../../utils/data/transfer/DataResponse";
declare const ApplicationView_base: CustomHTMLElementConstructor;
export default class ApplicationView extends ApplicationView_base {
    static get styles(): string;
    static get state(): Record<string, CustomElementStateMetadata>;
    render(): NodePatchingData | null;
    getRoutes(application: Application): GenericRecord;
    getModuleLinks(application: Application): GenericRecord;
    handleLoadedData(data: DataResponse): Promise<void>;
}
export {};
