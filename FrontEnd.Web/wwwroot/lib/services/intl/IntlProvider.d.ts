import Observer from "../../utils/observer/Observer";
export default class IntlProvider extends Observer {
    lang: string;
    data: Record<string, Record<string, string>>;
    constructor(lang: string, data: Record<string, Record<string, string>>);
    setLanguage(lang: string): void;
    getTranslation(lang: string | undefined, key: string): string | undefined;
}
