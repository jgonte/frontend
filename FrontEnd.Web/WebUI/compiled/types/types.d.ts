export declare class Accordion extends CustomElement {
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    constructor();
    render(): NodePatchingData;
    toggleContentVisibility(): void;
    renderExpanderIcon(): NodePatchingData;
}

export declare class Alert extends Alert_base {
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): NodePatchingData;
    private _renderIcon;
    private _getIconName;
}

declare const Alert_base: typeof Nuanced;

declare type AnyPatchedNode = PatchedNode | PatchedChildNode | PatchedHTMLElement;

declare class AppCtrl {
    application?: Application;
    errorHandler?: ErrorHandler;
    user?: User;
    intlProvider?: IntlProvider;
    iconsPath?: string;
    overlay: Overlay;
    apiUrl?: string;
    themeNamesUrl?: string;
    defaultTheme?: string;
    routeParams?: Record<string, string>;
    init(): Promise<void>;
    setTheme(theme: string): void;
    showDialog(content: () => NodePatchingData): void;
    handleSuccess(evt: CustomEvent): void;
    handleError(evt: CustomEvent): void;
}

export declare const appCtrl: AppCtrl;

export declare const AppInitializedEvent = "AppInitializedEvent";

declare interface Application {
    type: ApplicationType;
    useThemeSelector: boolean;
}

export declare class ApplicationHeader extends CustomElement {
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): NodePatchingData;
    renderLogo(logo: string): NodePatchingData | null;
    renderTitle(title: string): NodePatchingData | null;
    renderThemeSelector(useThemeSelector: boolean): NodePatchingData | null;
}

declare interface ApplicationType {
    logo: string;
    title: string;
    scripts: Script[];
    modules: Module[];
    routes: Route[];
}

export declare class ApplicationView extends ApplicationView_base {
    static get styles(): string;
    static get state(): Record<string, CustomElementStateMetadata>;
    render(): NodePatchingData | null;
    getRoutes(application: Application): GenericRecord;
    getModuleLinks(application: Application): GenericRecord;
    handleLoadedData(data: DataResponse): Promise<void>;
}

declare const ApplicationView_base: CustomHTMLElementConstructor;

export declare class Button extends Button_base {
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): NodePatchingData | NodePatchingData[] | null;
}

declare const Button_base: typeof Nuanced;

export declare class Center extends CustomElement {
    static get styles(): string;
}

export declare class CheckBox extends DisplayableField {
    value: boolean;
    static getFieldType(): DataTypes;
    render(): NodePatchingData;
}

export declare class CloseTool extends Tool {
    constructor();
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    handleClick(): void;
}

export declare class CollectionPanel extends CustomElement {
    private _deleteFetcher?;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    constructor();
    connectedCallback(): void;
    render(): NodePatchingData;
    renderToolbar(): NodePatchingData | null;
    renderDataGrid(): NodePatchingData;
    renderInsertDialog(): NodePatchingData | null;
    renderFormBody(): NodePatchingData;
    renderUpdateDialog(): NodePatchingData | null;
    renderDeleteDialog(): NodePatchingData;
    showAddForm(): void;
    showEditForm(record: GenericRecord): void;
    showConfirmDelete(record: GenericRecord): void;
    deleteRecord(record: GenericRecord): Promise<void>;
    handleSuccessfulDelete(): void;
}

export declare class ComboBox extends ComboBox_base {
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    constructor();
    render(): NodePatchingData;
    renderHeader(): NodePatchingData;
    renderItem(record: GenericRecord): NodePatchingData;
    onSelectionChanged(selection: GenericRecord, selectedChildren: CustomElement[]): void;
    handleChange(): void;
    renderContent(): NodePatchingData;
    renderSelectTemplate(): NodePatchingData;
    renderSingleSelectionTemplate(selection: SelectionTypes): NodePatchingData;
    renderMultipleSelectionTemplate(selection: SelectionTypes): NodePatchingData;
    beforeValueSet(value: unknown): unknown;
    onValueChanged(value: unknown, oldValue: unknown): void;
    private unwrapValue;
    private unwrapSingleValue;
}

declare const ComboBox_base: CustomHTMLElementConstructor;

declare interface CompiledNodePatcherRule {
    type: NodePatcherRuleTypes;
    node: Node;
}

declare type Constructor<T = GenericRecord> = new (...args: any[]) => T;

export declare class ContentView extends CustomElement {
    static get component(): CustomElementComponentMetadata;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
}

export declare function css(strings: TemplateStringsArray, ...values: unknown[]): string;

export declare class CustomElement extends CustomElement_base {
    static readonly isCustomElement: boolean;
    constructor();
    render(): RenderReturnTypes;
    connectedCallback(): void;
    disconnectedCallback(): void;
    dispatchCustomEvent(type: string, detail: GenericRecord): Promise<void>;
}

declare const CustomElement_base: CustomHTMLElementConstructor;

export declare interface CustomElementComponentMetadata {
    shadow: boolean;
}

declare interface CustomElementMetadata {
    shadow: boolean;
    properties: Map<string, CustomElementPropertyMetadata>;
    propertiesByAttribute: Map<string, CustomElementPropertyMetadata>;
    observedAttributes: string[];
    state: Map<string, CustomElementStateMetadata>;
    styles?: string;
}

export declare interface CustomElementPropertyMetadata extends CustomElementStateMetadata {
    attribute?: string;
    type: DataTypes | DataTypes[];
    defer?: boolean;
    reflect?: boolean;
    inherit?: boolean;
    required?: boolean;
    beforeSet?: (value: unknown) => unknown;
    canChange?: (value: unknown, oldValue: unknown) => boolean;
    afterChange?: (value: unknown, oldValue: unknown) => void;
    afterUpdate?: ParameterlessVoidFunction;
}

export declare interface CustomElementStateMetadata {
    name?: string;
    value?: unknown;
    options?: unknown[];
}

declare interface CustomHTMLElement extends HTMLElement {
    [index: string]: any;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attributeName: string, oldValue: string | null, newValue: string | null): void;
    render(): RenderReturnTypes;
    beforeRender(patchingData: NodePatchingTypes): NodePatchingTypes;
    get document(): HTMLElement | ShadowRoot;
    didMountCallback(): void;
    willUpdateCallback(): void;
    didUpdateCallback(): void;
    willUnmountCallback(): void;
    setProperty(name: string, value: unknown): void;
    setState(name: string, value: unknown): void;
    get updateComplete(): Promise<void>;
    stylesAdded: boolean;
    adoptedChildren: Set<Node>;
    didAdoptChildCallback(parent: CustomHTMLElement, child: HTMLElement): void;
    didAdoptChildrenCallback(parent: CustomHTMLElement, children: Set<Node>): void;
    willAbandonChildCallback(parent: CustomHTMLElement, child: HTMLElement): void;
    handleSlotChange: EventListenerOrEventListenerObject;
    enableEvents(): void;
    disableEvents(): void;
    _setProperty(name: string, value: unknown): boolean;
    _setState(name: string, value: unknown): boolean;
    clearChangedProperties(): void;
    updateDom(): Promise<void>;
    dispatchCustomEvent(type: string, detail: GenericRecord): Promise<void>;
    _$tempProperties?: GenericRecord;
}

export declare interface CustomHTMLElementConstructor extends Constructor<CustomHTMLElement> {
    isCustomElement: boolean;
    component: CustomElementComponentMetadata;
    properties: Record<string, CustomElementPropertyMetadata>;
    state: Record<string, CustomElementStateMetadata>;
    styles?: string;
    get metadata(): CustomElementMetadata;
}

export declare class DataCell extends CustomElement {
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): NodePatchingData;
}

export declare class DataGrid extends DataGrid_base {
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): NodePatchingData;
    renderHeader(): NodePatchingData;
    renderBody(): NodePatchingData[];
    load(): void;
}

declare const DataGrid_base: CustomHTMLElementConstructor;

declare const DataGridBodyRow_base: CustomHTMLElementConstructor;

declare interface DataGridColumnDescriptor {
    name: string;
    display: string | (() => NodePatchingData);
    width: string;
    sortable: boolean;
    headerStyle: string | GenericRecord;
    render: (value: unknown, record: GenericRecord, column: DataGridColumnDescriptor) => NodePatchingData;
}

export declare class DataGridHeader extends CustomElement {
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): NodePatchingData[];
}

export declare class DataHeaderCell extends CustomElement {
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): NodePatchingData;
    renderCellContainer(column: DataGridColumnDescriptor, display: NodePatchingData): NodePatchingData;
    renderSorter(): NodePatchingData | null;
}

export declare class DataList extends DataList_base {
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): NodePatchingData[];
}

declare const DataList_base: CustomHTMLElementConstructor;

declare interface DataResponse {
    headers: Headers;
    payload: GenericRecord | string;
}

export declare class DataRow extends DataGridBodyRow_base {
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): NodePatchingData[];
}

export declare class DataTemplate extends DataTemplate_base {
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): NodePatchingData;
}

declare const DataTemplate_base: typeof CustomElement;

export declare enum DataTypes {
    Boolean = "boolean",
    Number = "number",
    BigInt = "bigint",
    String = "string",
    Date = "date",
    Object = "object",
    Array = "array",
    Function = "function"
}

export declare class DateField extends DisplayableField {
    static getFieldType(): DataTypes;
    render(): NodePatchingData;
    beforeValueSet(value: string): Date;
    serializeValue(): string | null;
}

export declare function defineCustomElement(name: string, constructor: CustomElementConstructor | Constructor<HTMLElement>): void;

export declare abstract class DisplayableField extends DisplayableField_base {
    _initialValue?: unknown;
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    connectedCallback(): void;
    handleInput(event: Event): void;
}

declare const DisplayableField_base: CustomHTMLElementConstructor;

export declare class DropDown extends CustomElement {
    static get styles(): string;
    static get state(): Record<string, CustomElementStateMetadata>;
    constructor();
    render(): NodePatchingData;
    connectedCallback(): void;
    disconnectedCallback(): void;
    handleDropChanged(evt: CustomEvent): void;
    hideContent(): void;
}

declare type DynamicObject = object & GenericRecord;

declare interface ErrorHandler {
    handleError: (event: CustomEvent) => void;
}

export declare class ExpanderTool extends Tool {
    constructor();
    static get state(): Record<string, CustomElementStateMetadata>;
    iconName: () => "chevron-down" | "chevron-up";
    hideContent(): void;
    updateShowing(showing: boolean): void;
    handleClick(): void;
}

declare type ExtensibleHTMLElement = HTMLElement & GenericRecord;

declare abstract class Field extends Field_base {
    static dataFieldType: DataTypes;
    private _tempValue;
    isField: boolean;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void;
    hasRequiredValidator(): boolean;
    didAdoptChildCallback(parent: CustomHTMLElement, child: HTMLElement): void;
    handleBlur(): void;
    handleInput(event: Event): void;
    createValidationContext(): FieldValidationContext & {
        value: unknown;
    };
    private _label?;
    getLabel(): string;
    handleChange(): void;
    acceptChanges(): void;
}

declare const Field_base: CustomHTMLElementConstructor;

declare interface FieldValidationContext extends ValidationContext {
    label: string;
    field?: Field;
}

export declare class FileField extends DisplayableField {
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): NodePatchingData;
    openFileDialog(): void;
    renderFileList(): NodePatchingData[] | null;
}

export declare class Form extends Form_base {
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

declare const Form_base: CustomHTMLElementConstructor;

export declare class FormField extends CustomElement {
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    static get state(): Record<string, CustomElementStateMetadata>;
    render(): NodePatchingData;
    connectedCallback(): void;
    disconnectedCallback(): void;
    handleInput(event: CustomEvent): Promise<void>;
    handleValidation(event: CustomEvent): Promise<void>;
}

declare type GenericRecord = Record<string, unknown>;

export declare function getNotFoundView(): {
    new (): {
        render(): NodePatchingData;
    };
};

export declare class HashRouter extends CustomElement {
    private _lastHash?;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    connectedCallback(): void;
    disconnectedCallback(): void;
    route(): void;
    private _routeMatches;
    private _getSource;
    rewriteHash(path: string): void;
}

export declare class HelpTip extends CustomElement {
    render(): NodePatchingData;
}

export declare class HiddenField extends Field {
    render(): NodePatchingData;
}

export declare function html(strings: TemplateStringsArray, ...values: NodePatchingDataValues): NodePatchingData;

export declare class Icon extends CustomElement {
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): Promise<NodePatchingData | null>;
}

declare interface INodePatcher {
    template: HTMLTemplateElement;
    rules: NodePatcherRule[];
    keyIndex?: number;
    firstPatch(rules: CompiledNodePatcherRule[], values: NodePatchingDataValues): void;
    patchNode(rules: CompiledNodePatcherRule[], oldValues: NodePatchingDataValues, newValues: NodePatchingDataValues): void;
}

declare class IntlProvider extends Observer {
    lang: string;
    data: Record<string, Record<string, string>>;
    constructor(lang: string, data: Record<string, Record<string, string>>);
    setLanguage(lang: string): void;
    getTranslation(lang: string | undefined, key: string): string | undefined;
}

declare interface IRenderable {
    render(): RenderReturnTypes;
}

export declare class LocalizedText extends CustomElement {
    static get styles(): string;
    private _key;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): NodePatchingData;
    handleLanguageChanged(provider: IntlProvider): void;
}

export declare class ModifiedTip extends CustomElement {
    render(): NodePatchingData;
}

declare interface Module {
    name: string;
    scripts: Script[];
}

export declare function navigateToRoute(route: string, routerName?: string | undefined): void;

export declare class NavigationBar extends NavigationBar_base {
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): NodePatchingData;
    renderLinks(): NodePatchingData[];
    private renderGroupedLinks;
    private renderLink;
}

declare const NavigationBar_base: typeof CustomElement;

export declare class NavigationLink extends NavigationLink_base {
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    handleClick(): void;
}

declare const NavigationLink_base: typeof Nuanced;

declare interface NodePatcherRule {
    type: NodePatcherRuleTypes;
    path: number[];
    compile: (node: Node) => CompiledNodePatcherRule;
}

declare enum NodePatcherRuleTypes {
    PATCH_CHILDREN = "patch-children",
    PATCH_ATTRIBUTE = "patch-attribute",
    PATCH_EVENT = "patch-event"
}

export declare interface NodePatchingData {
    node?: AnyPatchedNode;
    patcher: INodePatcher;
    rules: CompiledNodePatcherRule[] | null;
    values: NodePatchingDataValues;
}

declare interface NodePatchingDataHolder {
    _$patchingData: NodePatchingData | string;
}

declare type NodePatchingDataValue = NodePatchingData | EventListenerOrEventListenerObject | string | number | boolean | object | null;

declare type NodePatchingDataValues = NodePatchingDataValue[] | NodePatchingDataValue[][];

declare type NodePatchingTypes = NodePatchingData | NodePatchingData[] | null;

declare class Nuanced extends Nuanced_base {
}

declare const Nuanced_base: CustomHTMLElementConstructor;

export declare class NumberField extends DisplayableField {
    render(): NodePatchingData;
}

declare class Observer {
    callbackName: string;
    private _subscribers;
    constructor(callbackName?: string);
    subscribe(subscriber: Subscriber): void;
    unsubscribe(subscriber: Subscriber): void;
    notify(...args: unknown[]): void;
}

export declare class Overlay extends CustomElement {
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    static get state(): Record<string, CustomElementStateMetadata>;
    connectedCallback(): void;
    disconnectedCallback(): void;
    handleClose(): void;
    render(): NodePatchingData | null;
}

export declare class Panel extends CustomElement {
    static get styles(): string;
    render(): RenderReturnTypes;
}

export declare class PanelHeader extends PanelHeader_base {
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): NodePatchingData;
    renderIcon(): NodePatchingData | null;
}

declare const PanelHeader_base: typeof CustomElement;

declare type ParameterlessVoidFunction = () => void;

export declare class PasswordField extends DisplayableField {
    render(): NodePatchingData;
}

declare type PatchedChildNode = ChildNode & NodePatchingDataHolder;

declare type PatchedHTMLElement = ExtensibleHTMLElement & NodePatchingDataHolder;

declare type PatchedNode = Node & NodePatchingDataHolder;

export declare class Pill extends Nuanced {
    static get styles(): string;
    render(): NodePatchingData;
}

export declare type RenderReturnTypes = NodePatchingData | NodePatchingData[] | Promise<NodePatchingData | null> | null;

export declare class RequiredTip extends CustomElement {
    render(): NodePatchingData;
}

declare interface Route {
    module?: string;
    name: string;
    path: string;
    view: string;
}

export declare class Row extends CustomElement {
    static get styles(): string;
    render(): NodePatchingData;
}

declare interface Script {
    type: string;
    source: string;
}

declare type SelectionTypes = Array<string> & {
    [x: string]: string;
};

export declare class Selector extends Selector_base {
}

declare const Selector_base: CustomHTMLElementConstructor;

declare interface SingleRecordDataProvider {
    getData(): DynamicObject;
}

export declare class Slider extends DisplayableField {
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): NodePatchingData;
    refreshSlider(value: number): void;
    connectedCallback(): void;
    updateX(x: number): void;
    eventHandler(e: MouseEvent): void;
}

export declare class SorterTool extends Tool {
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    static get state(): Record<string, CustomElementStateMetadata>;
    iconName: () => "arrow-down-up" | "arrow-up" | "arrow-down";
    handleClick(): void;
}

export declare class StarRating extends StarRating_base {
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): NodePatchingData[];
    selectionChanged: (selection: SelectionTypes) => void;
}

declare const StarRating_base: CustomHTMLElementConstructor;

declare interface Subscriber {
    [key: string]: ((...args: unknown[]) => void) | unknown | undefined;
}

export declare class TextArea extends DisplayableField {
    render(): NodePatchingData;
}

export declare class TextField extends DisplayableField {
    render(): NodePatchingData;
}

export declare class Theme {
    name?: string;
}

export declare abstract class Tool extends Tool_base {
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): NodePatchingData;
}

declare const Tool_base: typeof Nuanced;

export declare class ToolTip extends CustomElement {
    static get styles(): string;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): NodePatchingData;
    connectedCallback(): void;
    didMountCallback(): void;
    didUpdateCallback(): void;
    handleResize(): void;
    private _positionContent;
    getFittingPosition(trigger: HTMLElement, content: HTMLElement, pos: string): string;
}

declare interface User {
    username: string;
}

declare interface ValidationContext {
    dataProvider?: SingleRecordDataProvider;
    errors: string[];
    warnings: string[];
}

export declare class ValidationSummary extends CustomElement {
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    render(): NodePatchingData;
    renderWarnings(): any;
    renderErrors(): any;
}

export declare const viewsRegistry: Map<string, IRenderable | (() => NodePatchingData)>;

export declare class Wizard extends Wizard_base {
    sharedData: DynamicObject;
    private _forms;
    static get properties(): Record<string, CustomElementPropertyMetadata>;
    static get state(): Record<string, CustomElementStateMetadata>;
    constructor();
    render(): NodePatchingData;
    renderStep(): NodePatchingData;
    renderButtons(): NodePatchingData;
    handleBack(): void;
    handleNext(): void;
    handleFinish(): void;
    handleSubmitResponse(data: GenericRecord): void;
    getSubmitData(): DynamicObject;
    didMountCallback(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    handleFormConnected(event: CustomEvent): void;
    handleFormDisconnected(event: CustomEvent): void;
    private _hideBackButtonIfNecessary;
    private _hideNextButtonIfNecessary;
    private _hideFinishButtonIfNecessary;
    private _populateFormsFromSharedData;
    private _populateSharedDataFromForms;
}

declare const Wizard_base: typeof CustomElement;

export declare class WizardStep extends CustomElement {
}

export { }
