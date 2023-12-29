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
                        DataTypes.String
                    ],
                    defer: true
                }
            };
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
        renderCloseTool() {
            if (this.close === undefined) {
                return null;
            }
            return html `
<gcs-close-tool
    close=${() => this.handleClose()}
>
</gcs-close-tool>`;
        }
    };
}
//# sourceMappingURL=Closable.js.map