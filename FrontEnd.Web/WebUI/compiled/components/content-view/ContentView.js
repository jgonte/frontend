import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import { DataTypes } from "../../utils/data/DataTypes";
import { resourceLoader } from "../../utils/resourceLoader";
function createScriptNode(oldScript, newValue) {
    const newScript = document.createElement("script");
    Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
    newScript.setAttribute('data-view', newValue);
    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
    return newScript;
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
                    document.head.querySelectorAll('[data-view]').forEach(script => script.remove());
                    document.body.querySelectorAll('[data-view]').forEach(script => script.remove());
                    Array.from(head.children).forEach(child => {
                        if (child.tagName === 'SCRIPT') {
                            const newScript = createScriptNode(child, value);
                            document.head.appendChild(newScript);
                        }
                    });
                    Array.from(body.childNodes).forEach(node => {
                        if (node.tagName === 'SCRIPT') {
                            const newScript = createScriptNode(node, value);
                            document.body.appendChild(newScript);
                        }
                        else {
                            d.appendChild(node);
                        }
                    });
                }
            }
        };
    }
}
defineCustomElement('gcs-content-view', ContentView);
//# sourceMappingURL=ContentView.js.map