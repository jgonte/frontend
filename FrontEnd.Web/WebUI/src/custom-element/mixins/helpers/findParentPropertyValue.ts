import isUndefinedOrNull from "../../../utils/isUndefinedOrNull";
import CustomHTMLElement from "../metadata/types/CustomHTMLElement";

export default function findParentPropertyValue(element: CustomHTMLElement, name: string): unknown {

    let parent: CustomHTMLElement | null = element;

    do {

        const value = parent[name];

        if (!isUndefinedOrNull(value)) {

            return value;
        }

        parent = parent.parentElement as CustomHTMLElement;

    } while (parent !== null);

    return null;
}