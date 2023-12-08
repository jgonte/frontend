import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import Nuanced from "../Nuanced";
export default class Pill extends Nuanced {
    static get styles(): string;
    render(): NodePatchingData;
}
