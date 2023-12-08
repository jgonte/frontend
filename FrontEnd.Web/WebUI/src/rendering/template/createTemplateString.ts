import { attributeMarkerPrefix, beginMarker, endMarker, eventMarkerPrefix } from "./markers";

/**
 * The data returned by the createTemplateString function
 */
export interface TemplateStringData {

    /**
     * The string from which the template is created
     */
    templateString: string;

    /**
     * The index of the key to get the value from the values array
     */
    keyIndex?: number;
}

/**
 * Creates a a template string data
 */
export default function createTemplateString(strings: TemplateStringsArray): TemplateStringData {

    let keyIndex: number | undefined = undefined; // The index of the key to get the value from the values array

    const parts: string[] = [];

    if (strings.length === 1) { // No values ... literal only

        return {
            templateString: trimNode(strings[0]),
            keyIndex
        };
    }

    const length = strings.length - 1; // Exclude the last one

    let s: string;

    // Flag to indicate state whether we are dealing with a value for an attribute or an event
    let beginAttributeOrEvent: boolean = false;

    // Flag when a begin marker has been emitted but we transitioned to an attribute so we need to emit the end marker as well
    let beginMarkerSet: boolean = false;

    for (let i = 0; i < length; ++i) {

        s = strings[i];

        s = trimNode(s);

        if (s.lastIndexOf('>') < s.lastIndexOf('<') && // Opening tag
            !s.endsWith('=')) { // Not a full property

            throw new Error("Do not surround the placeholder for an attribute with single or double quotes or template a partial attribute");
        }

        if (s.endsWith('=')) { // It is an attribute or an event

            if (beginMarkerSet === true) {

                parts.push(`<!--${endMarker}-->`); // End the previous node

                beginMarkerSet = false;
            }

            const name = getAttributeName(s);

            beginAttributeOrEvent = true;

            if (name[0] === 'o' && name[1] === 'n') { // It is an event handler

                parts.push(`${s}"${eventMarkerPrefix}${name}"`);
            }
            else { // Not an event

                if (name === 'key') {

                    keyIndex = i;
                }

                parts.push(`${s}"${attributeMarkerPrefix}${name}"`);
            }
        }
        else { // It is the beginning of a text or element

            if (beginAttributeOrEvent === true) {

                beginAttributeOrEvent = false; // Clear the attribute flag
            }
            else if (i > 0) { // Ignore the first string

                parts.push(`<!--${endMarker}-->`); // End the previous node
            }

            parts.push(`${s}<!--${beginMarker}-->`);

            beginMarkerSet = true; // Flag that we set the begin marker
        }
    }

    // Add the ending string
    if (beginAttributeOrEvent === false) { // End of a text or element

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

function trimNode(s: string): string {

    const trimmedStart = s.trimStart();

    if (trimmedStart.startsWith('<') ||
        trimmedStart === '') {

        s = trimmedStart; // Remove any empty text nodes at the start so there are not extra unnecessary children
    }

    const trimmedEnd = s.trimEnd();

    if (trimmedEnd.endsWith('>')) {

        s = trimmedEnd;
    }

    return s;
}

function getAttributeName(s: string): string {

    let b: string[] = [];

    for (let i = s.lastIndexOf('=') - 1; i >= 0; --i) {

        if (s[i] === ' ') { // Finished with the name of the attribute

            break;
        }

        b = [s[i], ...b]; // Prepend
    }

    return b.join('');
}