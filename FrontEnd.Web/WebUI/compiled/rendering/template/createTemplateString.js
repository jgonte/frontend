import { attributeMarkerPrefix, beginMarker, endMarker, eventMarkerPrefix } from "./markers";
export default function createTemplateString(strings) {
    let keyIndex = undefined;
    const parts = [];
    if (strings.length === 1) {
        return {
            templateString: trimNode(strings[0]),
            keyIndex
        };
    }
    const length = strings.length - 1;
    let s;
    let beginAttributeOrEvent = false;
    let beginMarkerSet = false;
    for (let i = 0; i < length; ++i) {
        s = strings[i];
        s = trimNode(s);
        if (s.lastIndexOf('>') < s.lastIndexOf('<') &&
            !s.endsWith('=')) {
            throw new Error("Do not surround the placeholder for an attribute with single or double quotes or template a partial attribute");
        }
        if (s.endsWith('=')) {
            if (beginMarkerSet === true) {
                parts.push(`<!--${endMarker}-->`);
                beginMarkerSet = false;
            }
            const name = getAttributeName(s);
            beginAttributeOrEvent = true;
            if (name[0] === 'o' && name[1] === 'n') {
                parts.push(`${s}"${eventMarkerPrefix}${name}"`);
            }
            else {
                if (name === 'key') {
                    keyIndex = i;
                }
                parts.push(`${s}"${attributeMarkerPrefix}${name}"`);
            }
        }
        else {
            if (beginAttributeOrEvent === true) {
                beginAttributeOrEvent = false;
            }
            else if (i > 0) {
                parts.push(`<!--${endMarker}-->`);
            }
            parts.push(`${s}<!--${beginMarker}-->`);
            beginMarkerSet = true;
        }
    }
    if (beginAttributeOrEvent === false) {
        parts.push(`<!--${endMarker}-->`);
    }
    s = strings[length];
    s = trimNode(s);
    parts.push(s);
    return {
        templateString: parts.join(''),
        keyIndex
    };
}
function trimNode(s) {
    const trimmedStart = s.trimStart();
    if (trimmedStart.startsWith('<') ||
        trimmedStart === '') {
        s = trimmedStart;
    }
    const trimmedEnd = s.trimEnd();
    if (trimmedEnd.endsWith('>')) {
        s = trimmedEnd;
    }
    return s;
}
function getAttributeName(s) {
    let b = [];
    for (let i = s.lastIndexOf('=') - 1; i >= 0; --i) {
        if (s[i] === ' ') {
            break;
        }
        b = [s[i], ...b];
    }
    return b.join('');
}
//# sourceMappingURL=createTemplateString.js.map