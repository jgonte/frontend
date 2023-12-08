import CustomElement from "../custom-element/CustomElement";
import Kind from "./mixins/kind/Kind";
import Sizable from "./mixins/sizable/Sizable";
import Variant from "./mixins/variant/Variant";
export default class Nuanced extends Sizable(Variant(Kind(CustomElement))) {
}
//# sourceMappingURL=Nuanced.js.map