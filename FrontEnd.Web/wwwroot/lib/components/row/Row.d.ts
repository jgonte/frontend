import CustomElement from "../../custom-element/CustomElement";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
export default class Row extends CustomElement {
    static get styles(): string;
    render(): NodePatchingData;
}
