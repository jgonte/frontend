import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import isUndefinedOrNull from "../../utils/isUndefinedOrNull";
import clearCustomElements from "../../test/custom-element/helpers/clearCustomElements";
import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import { DataTypes } from "../../utils/data/DataTypes";

beforeEach(() => {

    clearCustomElements();
});

describe("custom element render tests", () => {

    it('should render the element even when there are no properties changing', async () => {

        class A extends CustomElement {

            render(): NodePatchingData {

                return html`
                    <span>Hello, my name is unknown</span>
                `;
            }
        }

        defineCustomElement('test-a', A);

        // Attach it to the DOM
        document.body.innerHTML = '<test-a></test-a>"';

        // Test the element
        const component = document.querySelector('test-a') as CustomElement;

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot?.innerHTML.trim()).toBe('<span>Hello, my name is unknown</span>');
    });

    it('should render the HTML with the default property', async () => {

        class A extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    name: {
                        type: DataTypes.String,
                        value: "Sarah"
                    }
                };
            }

            render(): NodePatchingData {

                return html`
                    <span>Hello, my name is ${this.name}</span>
                `;
            }
        }

        defineCustomElement('test-a', A);

        // Attach it to the DOM
        document.body.innerHTML = '<test-a></test-a>"';

        // Test the element
        const component = document.querySelector('test-a') as CustomElement;

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot?.innerHTML.trim()).toBe('<span>Hello, my name is <!--_$bm_-->Sarah<!--_$em_--></span>');
    });

    it('should not render a boolean property reflected property when it is false', async () => {

        class A extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    name: {
                        type: DataTypes.Boolean,
                        value: false,
                        reflect: true
                    }
                };
            }

            render(): NodePatchingData {

                const {
                    disabled
                } = this;

                return html`<span disabled=${disabled}>Sarah</span>`;
            }
        }

        defineCustomElement('test-a', A);

         // Attach it to the DOM
         document.body.innerHTML = '<test-a></test-a>"';

         // Test the element
         const component = document.querySelector('test-a') as CustomElement;
 
         await component.updateComplete; // Wait for the component to render
 
         expect(component.shadowRoot?.innerHTML).toBe("<span>Sarah</span>");
    });

    it('should render the HTML with the set property', async () => {

        class A extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    name: {
                        type: DataTypes.String,
                        value: "Sarah"
                    }
                };
            }

            render(): NodePatchingData {

                return html`
                    <span>Hello, my name is ${this.name}</span>
                `;
            }
        }

        defineCustomElement('test-a', A);

        // Attach it to the DOM
        document.body.innerHTML = '<test-a name="Mark"></test-a>"';

        // Test the element
        const component = document.querySelector('test-a') as CustomElement;

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot?.innerHTML.trim()).toBe('<span>Hello, my name is <!--_$bm_-->Mark<!--_$em_--></span>');
    });

    it('should render the HTML with the default property and the style attached', async () => {

        class A extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    name: {
                        type: DataTypes.String,
                        value: "Sarah"
                    },

                    age: {
                        type: DataTypes.Number,
                        value: 19
                    }
                };
            }

            static get styles(): string {

                return `:host { background-color: yellowgreen; }`;
            }

            render(): NodePatchingData {

                return html`
                    <span>Hello, my name is ${this.name}</span>
                    <span>My age is ${this.age}</span>
                `;
            }
        }

        defineCustomElement('test-a', A);

        // Attach it to the DOM
        document.body.innerHTML = '<test-a></test-a>"';

        // Test the element
        const component = document.querySelector('test-a') as CustomElement;

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot?.innerHTML).toBe("<style>:host { background-color: yellowgreen; }</style><span>Hello, my name is <!--_$bm_-->Sarah<!--_$em_--></span>\n                    <span>My age is <!--_$bm_-->19<!--_$em_--></span>");

        // Update the properties
        component.name = "Mark";

        component.age = 30;

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot?.innerHTML).toBe("<style>:host { background-color: yellowgreen; }</style><span>Hello, my name is <!--_$bm_-->Mark<!--_$em_--></span>\n                    <span>My age is <!--_$bm_-->30<!--_$em_--></span>");
    });

    it('should render the HTML with the set property and the style attached', async () => {

        class A extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    name: {
                        type: DataTypes.String,
                        value: "Sarah"
                    },

                    age: {
                        type: DataTypes.Number,
                        value: 19
                    }
                };
            }

            static get styles(): string {

                return `:host { background-color: yellowgreen; }`;
            }

            render(): NodePatchingData {

                return html`
                    <span>Hello, my name is ${this.name}</span>
                    <span>My age is ${this.age}</span>
                `;
            }
        }

        defineCustomElement('test-a', A);

        // Attach it to the DOM
        document.body.innerHTML = '<test-a name="Mark" age="31"></test-a>"';

        // Test the element
        const component = document.querySelector('test-a') as CustomElement;

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot?.innerHTML).toBe("<style>:host { background-color: yellowgreen; }</style><span>Hello, my name is <!--_$bm_-->Mark<!--_$em_--></span>\n                    <span>My age is <!--_$bm_-->31<!--_$em_--></span>");
    });

    it('should unmount the element', async () => {

        class A extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    name: {
                        type: DataTypes.String
                    }
                };
            }

            render(): NodePatchingData | null {

                const {
                    name
                } = this;

                if (isUndefinedOrNull(name) === true)  {

                    return null;
                }

                return html`<span>Hello, my name is ${this.name}</span>`;
            }
        }

        defineCustomElement('test-a', A);

        // Attach it to the DOM
        document.body.innerHTML = '<test-a name="Sarah"></test-a>"';

        // Test the element
        const component = document.querySelector('test-a') as CustomElement;

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot?.innerHTML).toBe("<span>Hello, my name is <!--_$bm_-->Sarah<!--_$em_--></span>");

        component.name = null;

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot?.innerHTML).toBe("");
    });

    it('should remove the function from the attribute but keep its reference in the property. Attribute name and property names are different', async () => {

        class A extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    /**
                     * The template to render the item
                     */
                    itemTemplate: {
                        attribute: 'item-template',
                        type: DataTypes.Function,
                        defer: true // Store the function itself instead of executing it to get its return value when initializing the property
                    }
                };
            }

            render(): NodePatchingData {

                const {
                    itemTemplate
                } = this;

                return (itemTemplate as () => NodePatchingData)();
            }
        }

        defineCustomElement('test-a', A);

        class B extends CustomElement {

            render(): NodePatchingData {

                return html`
                    <test-a item-template=${this.renderTemplate}></test-a>
                `;
            }

            renderTemplate() {

                return html`
                    <span>Hello!!!</span>
                `;

            }
        }

        defineCustomElement('test-b', B);

        // Attach it to the DOM
        document.body.innerHTML = '<test-b></test-b>"';

        // Test the element
        const component = document.querySelector('test-b') as CustomElement;

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot?.innerHTML).toBe("<test-a></test-a>");

        const childNode = component.shadowRoot?.childNodes[0] as CustomElement;

        expect(childNode.shadowRoot?.innerHTML).toBe("<span>Hello!!!</span>");

        expect(childNode.itemTemplate).toBeDefined();
    });

    it('should throw an error when an error is being thrown from render', async () => {

        class A extends CustomElement {

            render(): NodePatchingData {

                throw new Error('Throwing from render');
            }
        }

        defineCustomElement('test-a', A);

        try {

            // Attach it to the DOM
            document.body.innerHTML = '<test-a></test-a>';

            // Test the element
            const component = document.querySelector('test-a') as CustomElement;

            await component.updateComplete; // Wait for the component to render
        }
        catch (error) {

            expect((error as Error).message).toBe("Throwing from render");
        }
    });
    
});