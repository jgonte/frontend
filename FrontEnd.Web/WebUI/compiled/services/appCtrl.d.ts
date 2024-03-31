import Overlay from "../components/overlay/Overlay";
import { NodePatchingData } from "../rendering/nodes/NodePatchingData";
import Application from "./application/Application";
import ErrorHandler from "./errors/ErrorHandler";
import IntlProvider from "./intl/IntlProvider";
import User from "./user/User";
export declare const AppInitializedEvent = "AppInitializedEvent";
declare class AppCtrl {
    application?: Application;
    errorHandler?: ErrorHandler;
    user?: User;
    intlProvider?: IntlProvider;
    iconsPath?: string;
    overlay: Overlay;
    apiUrl?: string;
    defaultTheme?: string;
    routeParams?: Record<string, string>;
    init(): Promise<void>;
    setTheme(theme: string): void;
    showDialog(content: () => NodePatchingData): void;
    handleSuccess(evt: CustomEvent): void;
    handleError(evt: CustomEvent): void;
}
declare const appCtrl: AppCtrl;
export default appCtrl;
