import notifySuccess from "../../../services/success/notifySuccess";
export default function Successful(Base) {
    return class SuccessfulMixin extends Base {
        renderSuccess(successMessage) {
            notifySuccess(this, successMessage);
        }
    };
}
//# sourceMappingURL=Successful.js.map