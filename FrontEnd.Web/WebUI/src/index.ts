// Building blocks
import CustomHTMLElementConstructor from "./custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import CustomElement from "./custom-element/CustomElement";
import defineCustomElement from "./custom-element/defineCustomElement";
import CustomElementComponentMetadata from "./custom-element/mixins/metadata/types/CustomElementComponentMetadata";
import CustomElementPropertyMetadata from "./custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import { DataTypes } from "./utils/data/DataTypes";
import CustomElementStateMetadata from "./custom-element/mixins/metadata/types/CustomElementStateMetadata";
import { NodePatchingData } from "./rendering/nodes/NodePatchingData";
import html from "./rendering/html";
import css from "./custom-element/styles/css";
import { RenderReturnTypes } from "./custom-element/mixins/metadata/types/IRenderable";
import viewsRegistry from "./services/application/type/module/script/viewsRegistry";

// Application
import appCtrl, { AppInitializedEvent } from "./services/appCtrl";
import Theme from "./services/themes/Theme";

// Components
import Icon from "./components/icon/Icon";
import LocalizedText from "./components/localized-text/LocalizedText";
import Alert from "./components/alert/Alert";
import Accordion from "./components/accordion/Accordion";
import Pill from "./components/pill/Pill";
import Button from "./components/button/Button";
import ToolTip from "./components/tool-tip/ToolTip";
import DataTemplate from "./components/data-template/DataTemplate";
import Selector from "./components/selector/Selector";
import DropDown from "./components/drop-down/DropDown";

// Wizard
import WizardStep from "./components/wizard/step/WizardStep";
import Wizard from "./components/wizard/Wizard";

// Navigation
import NavigationLink from "./components/navigation/link/NavigationLink";
import NavigationBar from "./components/navigation/bar/NavigationBar";
import ContentView from "./components/content-view/ContentView";

// Tips
import HelpTip from "./components/tips/HelpTip";
import ModifiedTip from "./components/tips/ModifiedTip";
import RequiredTip from "./components/tips/RequiredTip";

// Layout
import Center from "./components/center/Center";
import Overlay from "./components/overlay/Overlay";
import PanelHeader from "./components/panel/header/PanelHeader";
import Panel from "./components/panel/Panel";

// Tools
import CloseTool from "./components/tools/close/CloseTool";
import ExpanderTool from "./components/tools/expander/ExpanderTool";
import SorterTool from "./components/tools/sorter/SorterTool";
import Tool from "./components/tools/Tool";

// Fields
import DisplayableField from "./components/fields/DisplayableField";
import ComboBox from "./components/fields/combo-box/ComboBox";
import DateField from "./components/fields/date/DateField";
import FileField from "./components/fields/file/FileField";
import HiddenField from "./components/fields/hidden/HiddenField";
import TextField from "./components/fields/text/TextField";
import TextArea from "./components/fields/text/TextArea";
import NumberField from "./components/fields/number/NumberField";
import CheckBox from "./components/fields/check-box/CheckBox";
import Slider from "./components/fields/slider/Slider";
import StarRating from "./components/fields/star-rating/StarRating";
import PasswordField from "./components/fields/password/PasswordField";

// Form
import FormField from "./components/form/form-field/FormField";
import Form from "./components/form/Form";
import ValidationSummary from "./components/validation-summary/ValidationSummary";

// Display
import DataList from "./components/data-list/DataList";
import DataGridBodyCell from "./components/data-grid/body/cell/DataGridBodyCell";
import DataGridBodyRow from "./components/data-grid/body/row/DataGridBodyRow";
import DataGridHeaderCell from "./components/data-grid/header/cell/DataGridHeaderCell";
import DataGridHeader from "./components/data-grid/header/DataGridHeader";
import DataGrid from "./components/data-grid/DataGrid";
import CollectionPanel from "./components/collection-panel/CollectionPanel";

// Routers
import HashRouter from "./components/routers/hash-router/HashRouter";

// Application
import ApplicationHeader from "./components/application/view/header/ApplicationHeader";
import ApplicationView from "./components/application/view/ApplicationView";

// Views
import getNotFoundView from "./components/views/getNotFoundView";

import { GenericRecord } from "./utils/types";
import { navigateToRoute } from "./components/routers/hash-router/utils/routersRegistry";

// Make it available in the global object of the browser to be used by scripts that are not of type module
(window as unknown as GenericRecord).appCtrl = appCtrl; // The parameters of the current route get stored here

(window as unknown as GenericRecord).html = html;

(window as unknown as GenericRecord).viewsRegistry = viewsRegistry;

export {
    // Building blocks
    CustomHTMLElementConstructor,
    CustomElement,
    CustomElementComponentMetadata,
    CustomElementPropertyMetadata,
    DataTypes,
    defineCustomElement,
    CustomElementStateMetadata,
    NodePatchingData,
    html,
    css,
    RenderReturnTypes,
    viewsRegistry,

    // Application
    appCtrl,
    AppInitializedEvent,
    Theme,

    // Components
    Icon,
    LocalizedText,
    Alert,
    Accordion,
    Pill,
    Button,
    ToolTip,
    DataTemplate,
    Selector,
    DropDown,

    // Wizard
    WizardStep,
    Wizard,

    // Navigation
    NavigationLink,
    NavigationBar,
    ContentView,

    // Tips
    RequiredTip,
    ModifiedTip,
    HelpTip,

    // Layout
    Center,
    Overlay,
    PanelHeader,
    Panel,

    // Tools
    Tool,
    CloseTool,
    ExpanderTool,
    SorterTool,

    // Fields 
    DisplayableField, // Allow for custom fields to extend this one
    TextField,
    TextArea,
    NumberField,
    CheckBox,
    DateField,
    FileField,
    ComboBox,
    HiddenField,
    Slider,
    StarRating,
    PasswordField,

    // Form
    FormField,
    Form,
    ValidationSummary,

    // Display
    DataList,
    DataGridHeaderCell as DataHeaderCell,
    DataGridHeader,
    DataGridBodyCell as DataCell,
    DataGridBodyRow as DataRow,
    DataGrid,
    CollectionPanel,

    // Routers
    HashRouter,

    // Application
    ApplicationHeader,
    ApplicationView,

    // Views
    getNotFoundView,

    // Router
    navigateToRoute
}