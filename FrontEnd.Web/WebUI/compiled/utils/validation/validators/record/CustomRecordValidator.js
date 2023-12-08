import RecordValidator from "./RecordValidator";
export default class CustomRecordValidator extends RecordValidator {
    validateFcn;
    constructor(message, options) {
        super(message, options);
        this.validateFcn = options.validateFcn;
    }
    validate(context) {
        const data = this.getData(context);
        const valid = this.validateFcn.call(this, data);
        if (!valid) {
            this.emitErrors(context, {});
        }
        return valid;
    }
}
//# sourceMappingURL=CustomRecordValidator.js.map