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
                        DataTypes.Boolean // If true, then dispatch a closing event
                    ],
                    defer: true
                }
            }
        }

        renderCloseTool(): NodePatchingData | null {

            const {
                close
            } = this;
    
            if (close === undefined) {
    
                return null;
            }
    
            const handleClose: (evt: Event) => void = close === true ?
                evt => this.dispatchCustomEvent(closingEvent, {
                    originalEvent: evt
                }) :
                evt => this.close(evt);
    
            return html`
    <gcs-close-tool 
        slot="end"
        close=${handleClose}
    >
    </gcs-close-tool>`;
        }
    }
}