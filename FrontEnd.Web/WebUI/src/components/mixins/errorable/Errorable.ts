import CustomElementStateMetadata from "../../../custom-element/mixins/metadata/types/CustomElementStateMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import notifyError from "../../../services/errors/notifyError";

/**
 * Mixin that handles errors
 * @param Base 
 */
 export default function Errorable<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class ErrorableMixin extends Base {

        static get state() : Record<string, CustomElementStateMetadata> {

            return {

                error: {
                    value: undefined
                }
            };
        }

        renderError() : void{

            const {
                error
            } = this;

            if (error !== undefined) {

               notifyError(this, error)

                this.error = undefined; // Clear the error
            }
        }

    };
}
