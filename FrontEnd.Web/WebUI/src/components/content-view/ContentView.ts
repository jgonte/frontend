import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementComponentMetadata from "../../custom-element/mixins/metadata/types/CustomElementComponentMetadata";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import IRenderable from "../../custom-element/mixins/metadata/types/IRenderable";
import { DataTypes } from "../../utils/data/DataTypes";
import { resourceLoader } from "../../utils/resourceLoader";

function copyNode(source: Element, dataView: string) {

    // https://stackoverflow.com/questions/28771542/why-dont-clonenode-script-tags-execute
    // const newNode = source.cloneNode(true) as Element;

    const newNode = document.createElement(source.nodeName);

    Array.from(source.attributes).forEach(attr => newNode.setAttribute((attr as Attr).name, (attr as Attr).value));

    newNode.setAttribute('data-view', dataView); // Set the view attribute so we can remove it when other views are selected

    newNode.appendChild(document.createTextNode(source.textContent || ''));

    return newNode;
}

/**
 * A view that renders dynamic content
 */
export default class ContentView extends CustomElement {

    static get component(): CustomElementComponentMetadata {

        return {

            // Do not create a shadow DOM for this component since the
            // scripts and styles are placed in the parent document
            shadow: false
        }
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The source to set the content from
             */
            source: {
                type: [
                    DataTypes.String,
                    DataTypes.Function
                ],
                defer: true, // If it is a function, defer it
                canChange: function () {

                    //TODO Test if any of the elements can unmount, for example, modified forms

                    // const {
                    //     document: d
                    // } = this as unknown as CustomElement;

                    // Traverse all the children

                    // If one of them can not disconnect return false

                    return true;
                },
                afterChange: async function (value: unknown): Promise<void> {

                    // Clear any previous content
                    const {
                        document: d
                    } = this as unknown as CustomElement;

                    while (d.firstChild) {

                        //(d.firstChild as CustomElement).willUnmountCallback?.();

                        d.firstChild.remove();
                    }

                    if (typeof value !== 'string') { // Assume a class with a render method

                        const newPatchingData = (value as IRenderable).render !== undefined ?
                            await (value as IRenderable).render() :
                            value; // The value is a node patching data

                        (this as unknown as CustomElement).mountDom(d, newPatchingData);

                        return; // Only for urls
                    }

                    const content = await resourceLoader.get(value as string);

                    const parser = new DOMParser();

                    // Even though it is a fragment, it creates a full HTML document
                    const {
                        head,
                        body
                    } = parser.parseFromString(content, "text/html");

                    // Remove any scripts and styles with the data-view attributes set
                    document.head.querySelectorAll('[data-view]').forEach(s => s.remove());

                    document.body.querySelectorAll('[data-view]').forEach(s => s.remove());

                    // Add any script that appears in the head
                    Array.from(head.children).forEach(child => {

                        if (child.tagName === 'SCRIPT' ||
                            child.tagName === 'STYLE') {

                            const newScript = copyNode(child, value as string);

                            document.head.appendChild(newScript);
                        }
                    });

                    // Add the new content
                    Array.from(body.children).forEach(child => {

                        if (child.tagName === 'SCRIPT' ||
                            child.tagName === 'STYLE'
                        ) {
                            const newScript = copyNode(child, value as string);

                            document.body.appendChild(newScript);
                        }
                        else { // Add it to this component

                            d.appendChild(child);
                        }
                    });

                }
            }

        };
    }
}

defineCustomElement('gcs-content-view', ContentView);