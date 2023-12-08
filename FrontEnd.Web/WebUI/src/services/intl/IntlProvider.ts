import Observer from "../../utils/observer/Observer";

export default class IntlProvider extends Observer {

	constructor(

		/**
		 * The current language set in the provider
		 */
		public lang: string,

		/**
		 * The data with the translation
		 */
		public data: Record<string, Record<string, string>>
	) {
		super('handleLanguageChanged');
	}

	setLanguage(lang: string) {

		if (this.lang !== lang) {

			this.lang = lang;

			this.notify();
		}
	}

	/**
	 * Retrieves the translated text or returns a string with the key value if the translation was not found
	 */
	getTranslation(lang: string | undefined, key: string): string | undefined {

		// If the lang is not provided use the current language of the provider
		const lng = lang || this.lang;

		const data = this.data[lng];

		if (data === undefined) { // There are no translations for this language

			console.error(`There are no translations for language: [${lng}]. (key was [${key}]).`);

			return undefined;
		}

		const translation = data[key];

		if (translation === undefined) { // There is no translation for this key in this language
		
			console.error(`Missing translation for key: [${key}] in language: [${lng}].`);

			return undefined;
		}

		return translation;
	}
}
