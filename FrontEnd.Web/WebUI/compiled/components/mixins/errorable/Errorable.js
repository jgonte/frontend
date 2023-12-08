import notifyError from "../../../services/errors/notifyError";
export default function Errorable(Base) {
    return class ErrorableMixin extends Base {
        static get state() {
            return {
                error: {
                    value: undefined
                }
            };
        }
        renderError() {
            const { error } = this;
            if (error !== undefined) {
                notifyError(this, error);
                this.error = undefined;
            }
        }
    };
}
//# sourceMappingURL=Errorable.js.map