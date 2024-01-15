import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import { DataTypes } from "../../utils/data/DataTypes";
import { resourceLoader } from "../../utils/resourceLoader";
function copyNode(source, dataView) {
    const newNode = document.createElement(source.nodeName);
    Array.from(source.attributes).forEach(attr => newNode.setAttribute(attr.name, attr.value));
    newNode.setAttribute('data-view', dataView);
    newNode.appendChild(document.createTextNode(source.textContent || ''));
    return newNode;
}
export default class ContentView extends CustomElement {
    static get component() {
        return {
            shadow: false
        };
    }
    static get properties() {
        return {
            source: {
                type: [
                    DataTypes.String,
                    DataTypes.Function
                ],
                defer: true,
                canChange: function () {
                    return true;
                },
                afterChange: async function (value) {
                    const { document: d } = this;
                    while (d.firstChild) {
                        d.firstChild.remove();
                    }
                    if (typeof value !== 'string') {
                        const newPatchingData = value.render !== undefined ?
                            await value.render() :
                            value;
                        this.mountDom(d, newPatchingData);
                        return;
                    }
                    const content = await resourceLoader.get(value);
                    const parser = new DOMParser();
                    const { head, body } = parser.parseFromString(content, "text/html");
                    document.head.querySelectorAll('[data-view]').forEach(s => s.remove());
                    document.body.querySelectorAll('[data-view]').forEach(s => s.remove());
                    Array.from(head.children).forEach(child => {
                        if (child.tagName === 'SCRIPT' ||
                            child.tagName === 'STYLE') {
                            const newScript = copyNode(child, value);
                            document.head.appendChild(newScript);
                        }
                    });
                    Array.from(body.children).forEach(child => {
                        if (child.tagName === 'SCRIPT' ||
                            child.tagName === 'STYLE') {
                            const newScript = copyNode(child, value);
                            document.body.appendChild(newScript);
                        }
                        else {
                            d.appendChild(child);
                        }
                    });
                }
            }
        };
    }
}
defineCustomElement('gcs-content-view', ContentView);
//# sourceMappingURL=ContentView.js.map