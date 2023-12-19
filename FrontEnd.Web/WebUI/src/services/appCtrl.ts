import Dialog from "../components/dialog.ts/Dialog";
import { updateRoutes } from "../components/routers/hash-router/utils/routersRegistry";
import html from "../rendering/html";
import { NodePatchingData } from "../rendering/nodes/NodePatchingData";
import { GenericRecord } from "../utils/types";
import AppConfig from "./AppConfig";
import Application from "./application/Application";
import ErrorHandler, { errorEvent } from "./errors/ErrorHandler";
import IntlProvider from "./intl/IntlProvider";
import { successEvent } from "./success/notifySuccess";
import User from "./user/User";

export const AppInitializedEvent = "AppInitializedEvent";

/**
 * The singleton application controller so it is accessable from everywhere
 */
class AppCtrl {

	/**
	 * The selected (loaded) application
	 */
	application?: Application;

	/**
	 * The auth provider of the application
	 */
	//authProvider?: AuthProvider;

	/**
	 * The error handler of the application
	 */
	errorHandler?: ErrorHandler;

	/**
	 * The user using the application
	 */
	user?: User;

	/**
	 * The internationalization provider of the app
	 */
	intlProvider?: IntlProvider;

	/**
	 * The path to the icons library
	 */
	iconsPath?: string;

	/**
	 * The dialog to show the messages for the application
	 */
	dialog: Dialog = new Dialog();

	/**
	 * The url to the APIs
	 */
	apiUrl?: string;

	/**
	 * The data with the names of the tems to feed the selector
	 */
	themeNamesUrl?: string;

	/**
	 * The default theme of the application
	 */
	defaultTheme?: string;

	/**
	 * The parameter that were parsed from the current route
	 */
    routeParams?: Record<string, string>;

	/**
	 * Initializes the application controller
	 */
	async init() {

		console.log('Initializing appCtrl...');

		this.handleSuccess = this.handleSuccess.bind(this);

		this.handleError = this.handleError.bind(this);

		const appConfig = (window as unknown as GenericRecord).appConfig as AppConfig;

		if (appConfig !== undefined) {

			const {
				// auth,
				errorHandler,
				intl,
				iconsPath,
				apiUrl,
				themeNamesUrl,
				defaultTheme
			} = appConfig;

			// if (auth !== undefined) {

			// 	appCtrl.authProvider = new OidcProvider(auth);
			// }

			if (intl !== undefined) {

				const lang = intl.lang || window.document.documentElement.getAttribute('lang') || window.navigator.language;

				this.intlProvider = new IntlProvider(lang, intl.data);
			}

			this.errorHandler = errorHandler;

			this.iconsPath = iconsPath;

			this.apiUrl = apiUrl;

			this.themeNamesUrl = themeNamesUrl;

			this.defaultTheme = defaultTheme;

			window.dispatchEvent(
				new CustomEvent(
					AppInitializedEvent,
					{
						bubbles: true,
						composed: true, // To bubble through the shadow DOM
					}
				)
			);
		}

		// Load and set the themes
		const themeName = window.localStorage.getItem('app-theme') || appCtrl.defaultTheme;

		// Set the theme
		this.setTheme(themeName as string);

		// Append the app dialog to post any messages
		document.body.appendChild(this.dialog);

		// Handle success messages
		document.addEventListener(successEvent, this.handleSuccess as EventListenerOrEventListenerObject);

		// Handle app errors
		document.addEventListener(errorEvent, this.handleError as EventListenerOrEventListenerObject);

		// Listen to route changes
		window.addEventListener('hashchange', updateRoutes as EventListenerOrEventListenerObject);

		updateRoutes(); // Do first routing
	}

	setTheme(theme: string): void {

		(window.document.firstElementChild as HTMLElement).setAttribute('theme', theme);
	}

	showDialog(content: () => NodePatchingData) {

		const {
			dialog
		} = this;

		dialog.content = content;

		dialog.showing = true;
	}

	handleSuccess(evt: CustomEvent): void {

		const {
			successMessage,
		} = evt.detail;

		const content = () => html`<gcs-alert kind="success" close>${successMessage}</gcs-alert>`;

		this.showDialog(content);
	}

	handleError(evt: CustomEvent): void {

		const {
			errorHandler
		} = this;

		if (errorHandler !== undefined) {

			errorHandler.handleError(evt);
		}
		else {

			const {
				error,
			} = evt.detail;

			const content = () => html`<gcs-alert kind="danger" close>${error.message || error.statusText}</gcs-alert>`;

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