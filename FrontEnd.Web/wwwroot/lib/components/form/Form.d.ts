import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { ValidationContext } from "../../utils/validation/validators/Validator";
import Field from "../fields/Field";
import { DynamicObject, GenericRecord } from "../../utils/types";
import DataResponse from "../../utils/data/transfer/DataResponse";
export declare const formConnectedEvent = "formConnectedEvent";
export declare const formDisconnectedEvent = "formDisconnectedEvent";
declare const Form_base: CustomHTMLElementConstructor;
export default class Form extends Form_base {
    private _fields;
    modifiedFields: Set<Field>;
    constructor();
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): NodePatchingData;
    private _renderButton;
    getSubmitData(): DynamicObject;
    submit(): void;
    createValidationContext(): ValidationContext;
    handleLoadedData(data: DataResponse): void;
    handleSubmitResponse(data: GenericRecord): void;
    setData(data: DynamicObject, acceptChanges?: boolean): void;
    getData(): DynamicObject;
    validate(): boolean;
    connectedCallback(): void;
    disconnectedCallback(): void;
    handleBeforeUnload(evt: BeforeUnloadEvent): void;
    handleFieldAdded(event: CustomEvent): void;
    handleChange(event: CustomEvent): void;
}
export {};
