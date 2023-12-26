import CustomElement from "../custom-element/CustomElement";
import CustomHTMLElementConstructor from "../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import Kind from "./mixins/kind/Kind";
import Variant from "./mixins/variant/Variant";

/**
 * Custom element that has size, kind and variants
 * Extended by buttons, icons and pills
 */
export default class Nuanced extends
    Variant(
        Kind(
            CustomElement as CustomHTMLElementConstructor
        )
    ) {
}