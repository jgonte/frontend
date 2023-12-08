import isCustomElement from "../../custom-element/isCustomElement";
import valueConverter from "../../custom-element/mixins/helpers/valueConverter";
import isUndefinedOrNull from "../../utils/isUndefinedOrNull";
export default function setAttribute(node, attributeName, propertyName, value) {
    const type = typeof value;
    const isComplexType = (type === "function" || type === "object");
    if (isCustomElement(node) &&
        node.isInitialized !== true) {
        if (isComplexType) {
            node._$tempProperties ??= {};
            node._$tempProperties[propertyName] = value;
            node.removeAttribute(attributeName);
        }
        else {
            setPrimitiveAttribute(node, attributeName, value);
        }
        return;
    }
    if (isUndefinedOrNull(value) ||
        value === false) {
        node.removeAttribute(attributeName);
        if (attributeName === "value") {
            node.value = "";
        }
        else {
            node[propertyName] = value;
        }
    }
    else {
        if (isComplexType) {
            node[propertyName] = value;
            node.removeAttribute(attributeName);
        }
        else {
            setPrimitiveAttribute(node, attributeName, value);
        }
    }
}
function setPrimitiveAttribute(node, attributeName, value) {
    if (isUndefinedOrNull(value) ||
        value === false) {
        node.removeAttribute(attributeName);
        return;
    }
    if (attributeName === "value") {
        node.value = value;
    }
    const v = valueConverter.toAttribute(value);
    node.setAttribute(attributeName, v);
}
//# sourceMappingURL=setAttribute.js.map