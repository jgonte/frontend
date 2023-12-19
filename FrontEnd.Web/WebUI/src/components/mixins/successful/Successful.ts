import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import notifySuccess from "../../../services/success/notifySuccess";

/**
 * Mixin that handles success messages
 * @param Base 
 */
 export default function Successful<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class SuccessfulMixin extends Base {

        renderSuccess(successMessage: string) : void{

            notifySuccess(this, successMessage)
        }
    };
}
