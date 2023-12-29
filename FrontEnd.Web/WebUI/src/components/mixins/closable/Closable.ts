import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import html from "../../../rendering/html";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../../utils/data/DataTypes";
import { closingEvent } from "../../tools/close/CloseTool";

export default function Closable<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class ClosableMixin extends Base {

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                /**
                 * What action to execute when the alert has been closed
                 * If it is not defined, then the close tool will not be shown
                 */
                close: {
                    type: [
                        DataTypes.Function, // If the function is provided, then call it                   
                        DataTypes.String // Allow to specify a source value
                    ],
                    defer: true
                }
            }
        }

        handleClose() {

            if (typeof this.close === "function") {

                this.close();
            }
            else if (typeof this.close === "string") {

                this.dispatchCustomEvent(closingEvent, {
                    source: this.close
                });
            }
            else {

                throw new Error("Unknown close type in Closable::handleClose");
            }
        }

        renderCloseTool(): NodePatchingData | null {
    
            if (this.close === undefined) {
    
                return null;
            }
    
            return html`
<gcs-close-tool
    close=${() => this.handleClose()}
>
</gcs-close-tool>`;
        }
    }
}