import { GenericRecord } from "./types";

export default function deserializeXmlDocument(document: Document): GenericRecord {

    const o: GenericRecord = {};

    const childNodes = document.documentElement.childNodes;

    const length = childNodes.length;

    for (let i = 0; i < length; ++i) {

        const childNode = childNodes[i];

        if (childNode.nodeType === Node.ELEMENT_NODE) {

            o[childNode.nodeName] = childNode.childNodes[0].nodeValue;
        }
    }

    return o;
}