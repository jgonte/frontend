import RequiredValidator from "./validators/field/RequiredValidator";
import MaxLengthValidator from "./validators/field/MaxLengthValidator";
import EmailValidator from "./validators/field/EmailValidator";
import CompareValidator from "./validators/record/CompareValidator";
import ServerFieldValidator from "./validators/field/ServerFieldValidator";
export default function createValidator(cfg) {
    const { type, options } = cfg;
    switch (type) {
        case 'required': return new RequiredValidator(options);
        case 'max-length': return new MaxLengthValidator(options);
        case 'email': return new EmailValidator(options);
        case 'compare': return new CompareValidator(options);
        case 'server': return new ServerFieldValidator(options);
        default: throw new Error(`createValidator is not implemented for validator of type: '${type}'`);
    }
}
//# sourceMappingURL=createValidator.js.map