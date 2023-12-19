import Dialog from "../components/dialog.ts/Dialog";
import { updateRoutes } from "../components/routers/hash-router/utils/routersRegistry";
import html from "../rendering/html";
import { errorEvent } from "./errors/ErrorHandler";
import IntlProvider from "./intl/IntlProvider";
import { successEvent } from "./success/notifySuccess";
export const AppInitializedEvent = "AppInitializedEvent";
class AppCtrl {
    application;
    errorHandler;
    user;
    intlProvider;
    iconsPath;
    dialog = new Dialog();
    apiUrl;
    themeNamesUrl;
    defaultTheme;
    routeParams;
    async init() {
        console.log('Initializing appCtrl...');
        this.handleSuccess = this.handleSuccess.bind(this);
        this.handleError = this.handleError.bind(this);
        const appConfig = window.appConfig;
        if (appConfig !== undefined) {
            const { errorHandler, intl, iconsPath, apiUrl, themeNamesUrl, defaultTheme } = appConfig;
            if (intl !== undefined) {
                const lang = intl.lang || window.document.documentElement.getAttribute('lang') || window.navigator.language;
                this.intlProvider = new IntlProvider(lang, intl.data);
            }
            this.errorHandler = errorHandler;
            this.iconsPath = iconsPath;
            this.apiUrl = apiUrl;
            this.themeNamesUrl = themeNamesUrl;
            this.defaultTheme = defaultTheme;
            window.dispatchEvent(new CustomEvent(AppInitializedEvent, {
                bubbles: true,
                composed: true,
            }));
        }
        const themeName = window.localStorage.getItem('app-theme') || appCtrl.defaultTheme;
        this.setTheme(themeName);
        document.body.appendChild(this.dialog);
        document.addEventListener(successEvent, this.handleSuccess);
        document.addEventListener(errorEvent, this.handleError);
        window.addEventListener('hashchange', updateRoutes);
        updateRoutes();
    }
    setTheme(theme) {
        window.document.firstElementChild.setAttribute('theme', theme);
    }
    showDialog(content) {
        const { dialog } = this;
        dialog.content = content;
        dialog.showing = true;
    }
    handleSuccess(evt) {
        const { successMessage, } = evt.detail;
        const content = () => html `<gcs-alert kind="success" close>${successMessage}</gcs-alert>`;
        this.showDialog(content);
    }
    handleError(evt) {
        const { errorHandler } = this;
        if (errorHandler !== undefined) {
            errorHandler.handleError(evt);
        }
        else {
            const { error, } = evt.detail;
            const content = () => html `<gcs-alert kind="danger" close>${error.message || error.statusText}</gcs-alert>`;
            this.showDialog(content);
        }
    }
}
const appCtrl = new AppCtrl();
await appCtrl.init();
window.addEventListener('languagechange', () => {
    console.log("languagechange event detected!");
});
export default appCtrl;
//# sourceMappingURL=appCtrl.js.map