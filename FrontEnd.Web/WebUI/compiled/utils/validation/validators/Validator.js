import appCtrl from "../../../services/appCtrl";
import template from "../../template";
export default class Validator {
    message;
    constructor(defaultMessage, options) {
        this.message = options?.message || defaultMessage;
        const intlProvider = appCtrl.intlProvider;
        if (intlProvider !== undefined) {
            this.message = intlProvider.getTranslation(intlProvider.lang, this.message) || this.message;
        }
    }
    emitErrors(context, data) {
        const result = template(this.message, data);
        context.errors.push(result.text);
    }
    emitWarnings(context, data) {
        const result = template(this.message, data);
        context.warnings.push(result.text);
    }
}
//# sourceMappingURL=Validator.js.map