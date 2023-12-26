import html from "../../../rendering/html";
import { DataTypes } from "../../../utils/data/DataTypes";
import { closingEvent } from "../../tools/close/CloseTool";
export default function Closable(Base) {
    return class ClosableMixin extends Base {
        static get properties() {
            return {
                close: {
                    type: [
                        DataTypes.Function,
                        DataTypes.Boolean
                    ],
                    defer: true
                }
            };
        }
        renderCloseTool() {
            const { close } = this;
            if (close === undefined) {
                return null;
            }
            const handleClose = close === true ?
                evt => this.dispatchCustomEvent(closingEvent, {
                    originalEvent: evt
                }) :
                evt => this.close(evt);
            return html `
    <gcs-close-tool 
        slot="end"
        close=${handleClose}
    >
    </gcs-close-tool>`;
        }
    };
}
//# sourceMappingURL=Closable.js.map