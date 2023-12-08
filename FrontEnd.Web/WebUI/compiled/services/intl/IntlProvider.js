import Observer from "../../utils/observer/Observer";
export default class IntlProvider extends Observer {
    lang;
    data;
    constructor(lang, data) {
        super('handleLanguageChanged');
        this.lang = lang;
        this.data = data;
    }
    setLanguage(lang) {
        if (this.lang !== lang) {
            this.lang = lang;
            this.notify();
        }
    }
    getTranslation(lang, key) {
        const lng = lang || this.lang;
        const data = this.data[lng];
        if (data === undefined) {
            console.error(`There are no translations for language: [${lng}]. (key was [${key}]).`);
            return undefined;
        }
        const translation = data[key];
        if (translation === undefined) {
            console.error(`Missing translation for key: [${key}] in language: [${lng}].`);
            return undefined;
        }
        return translation;
    }
}
//# sourceMappingURL=IntlProvider.js.map