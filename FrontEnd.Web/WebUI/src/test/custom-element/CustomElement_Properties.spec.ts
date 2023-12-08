import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import clearCustomElements from "../../test/custom-element/helpers/clearCustomElements";
import { DataTypes } from "../../utils/data/DataTypes";

beforeEach(() => {

    clearCustomElements();
});

describe("CustomElement properties tests", () => {

    it('should set the default property value', () => {

        class A extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    type: {
                        type: DataTypes.String,
                        value: "a"
                    }
                };
            }

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-a', A);

        // Attach it to the DOM
        document.body.innerHTML = '<test-a></test-a>';

        // Test the element
        const component = document.querySelector('test-a') as CustomElement;

        expect(component.type).toBe('a');

        // Try to set the same attribute
        component.setAttribute('type', 'a');

        expect(component.type).toBe('a');

        const metadata = (component.constructor as CustomHTMLElementConstructor).metadata;

        expect(metadata.properties.size).toEqual(1);
    });

    it('should populate a property from a value from a function', () => {

        class A extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    type: {
                        type: DataTypes.Function
                    }
                };
            }

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-a', A);

        (window as unknown as { getType: () => string }).getType = () => "a";

        // Attach it to the DOM
        document.body.innerHTML = '<test-a type="getType()"></test-a>';

        // Test the element
        const component = document.querySelector('test-a') as CustomElement;

        expect(component.type).toBe('a');
    });

    it('should populate a boolean property', () => {

        class A extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    simple: {
                        type: DataTypes.Boolean,
                        reflect: true
                    }
                };
            }

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-a', A);

        // Attach it to the DOM
        document.body.innerHTML = '<test-a simple></test-a>';

        // Test the element
        const component = document.querySelector('test-a') as CustomElement;

        expect(component.simple).toBe(true);

        component.simple = false;

        expect(component.outerHTML).toBe('<test-a></test-a>');

        component.simple = true;

        expect(component.outerHTML).toBe('<test-a simple=""></test-a>');
    });

    it('should populate an object property', () => {

        class A extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    simple: {
                        type: DataTypes.Object,
                        reflect: true
                    }
                };
            }

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-a', A);

        // Attach it to the DOM
        document.body.innerHTML = '<test-a></test-a>';

        // Test the element
        const component = document.querySelector('test-a') as CustomElement;

        component.simple = { is: true };

        expect(component.outerHTML).toBe("<test-a simple=\"{&quot;is&quot;:true}\"></test-a>");
    });

    it('should throw an error when the attribute is bad-formed JSON', () => {

        class A extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    type: {
                        type: DataTypes.Object
                    }
                };
            }

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-a', A);

        try {

            // Attach it to the DOM
            document.body.innerHTML = '<test-a type="{ e = 1 }"></test-a>';

            expect(true).toBeFalsy(); // It should never reach here
        }
        catch (error) {

            expect((error as Error).message).toBe("Unexpected token e in JSON at position 2");
        }
    });

    it('should throw an error when the attribute is an object but the expected type is an array', () => {

        class A extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    type: {
                        type: DataTypes.Array
                    }
                };
            }

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-a', A);

        try {

            // Attach it to the DOM
            document.body.innerHTML = `<test-a type='{ "e":1 }'></test-a>`;

            expect(true).toBeFalsy(); // It should never reach here
        }
        catch (error) {

            expect((error as Error).message).toBe("value: { \"e\":1 } is not an array but there is no object type expected");
        }
    });

    it('should throw an error when the attribute is an array but the expected type is an object', () => {

        class A extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    type: {
                        type: DataTypes.Object
                    }
                };
            }

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-a', A);

        try {

            // Attach it to the DOM
            document.body.innerHTML = `<test-a type='[{ "e":1 }]'></test-a>`;

            expect(true).toBeFalsy(); // It should never reach here
        }
        catch (error) {

            expect((error as Error).message).toBe("value: [{ \"e\":1 }] is an array but there is no array type expected");
        }
    });

    it('should reflect a property change in its attribute', () => {

        class A extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    type: {
                        type: DataTypes.String,
                        value: "a",
                        reflect: true
                    }
                };
            }

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-a', A);

        // Attach it to the DOM
        document.body.innerHTML = '<test-a></test-a>';

        // Test the element
        const component = document.querySelector('test-a') as CustomElement;

        expect(component.type).toBe('a');

        // Try to set the same attribute
        component.setAttribute('type', 'a');

        expect(component.type).toBe('a');

        component.type = "b";

        expect(component.outerHTML).toEqual("<test-a type=\"b\"></test-a>"); // The property reflected on the attribute
    });

    it('should reflect a property change in its attribute when set to null', () => {

        class A extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    type: {
                        type: DataTypes.String,
                        value: "a",
                        reflect: true
                    }
                };
            }

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-a', A);

        // Attach it to the DOM
        document.body.innerHTML = '<test-a></test-a>';

        // Test the element
        const component = document.querySelector('test-a') as CustomElement;

        expect(component.type).toBe('a');

        // Try to set the same attribute
        component.setAttribute('type', 'a');

        expect(component.type).toBe('a');

        component.type = null;

        expect(component.outerHTML).toEqual("<test-a></test-a>"); // The property reflected on the attribute
    });

    it('should transform a property before setting it', () => {

        class A extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    type: {
                        type: DataTypes.Number,
                        // Transform before setting the property
                        beforeSet: v => 2 * (v as number)
                    }
                };
            }

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-a', A);

        // Attach it to the DOM
        document.body.innerHTML = '<test-a type="13"></test-a>';

        // Test the element
        const component = document.querySelector('test-a') as CustomElement;

        expect(component.type).toBe(26);
    });

    it('should call the afterUpdate method of the property after mounting/updating the element', async () => {

        const callTester = {

            refreshType(type: string): void {

                console.log(type);
            }
        };

        class A extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    type: {
                        type: DataTypes.String,
                        value: "a", // Options: "a" | "b" | "c"
                        afterUpdate: function () {

                            callTester.refreshType(this.type as string);
                        }
                    }
                };
            }

            render(): NodePatchingData | NodePatchingData[] | null {

                return html`<span>My type is: '${this.type}'</span>`;
            }
        }

        const spyRefreshType = jest.spyOn(callTester, 'refreshType');

        defineCustomElement('test-a', A);

        // Attach it to the DOM
        document.body.innerHTML = '<test-a type="a"></test-a>';

        // Test the element
        const component = document.querySelector('test-a') as CustomElement;

        await component.updateComplete; // Wait for the component to render

        expect(component.type).toBe("a");

        expect(spyRefreshType).toHaveBeenNthCalledWith(1, "a"); // Children should be called first
    });

    it('should set the property value to a function', () => {

        class A extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    type: {
                        type: DataTypes.Function,
                        value: () => 5
                    }
                };
            }

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-a', A);

        // Attach it to the DOM
        document.body.innerHTML = '<test-a></test-a>';

        // Test the element
        const component = document.querySelector('test-a') as CustomElement;

        expect(component.type).toBe(5);
    });

    it('should set the property values of the derived class', () => {

        class A extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    baseProp: {
                        attribute: "base-prop",
                        type: DataTypes.Number,
                        value: 13
                    }
                };
            }

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-a', A);

        class B extends A {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    derivedProp: {
                        attribute: "derived-prop",
                        type: DataTypes.Number,
                        value: 26
                    }
                };
            }

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-b', B);

        // Attach it to the DOM
        document.body.innerHTML = "<test-b></test-b>";

        // Test the element
        const component = document.querySelector('test-b') as CustomElement;

        expect(component.baseProp).toBe(13);

        expect(component.derivedProp).toBe(26);
    });

    it('should set the property values of the mixed-in class', () => {

        class A extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    baseProp: {
                        attribute: "base-prop",
                        type: DataTypes.Number,
                        value: 13
                    }
                };
            }

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-a', A);

        function Mixin<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

            return class AMixin extends Base {

                static get properties(): Record<string, CustomElementPropertyMetadata> {

                    return {

                        derivedProp: {
                            attribute: "derived-prop",
                            type: DataTypes.Number,
                            value: 26
                        }
                    };
                }
            }
        }

        class B extends Mixin(A) {
        }

        defineCustomElement('test-b', B);

        // Attach it to the DOM
        document.body.innerHTML = "<test-b></test-b>";

        // Test the element
        const component = document.querySelector('test-b') as CustomElement;

        expect(component.baseProp).toBe(13);

        expect(component.derivedProp).toBe(26);
    });

    it('should throw an error when the attribute does not correspond to the options', () => {

        class A extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    type: {
                        type: DataTypes.String,
                        value: "a",
                        options: ["a", "b", "c"]
                    }
                };
            }

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-a', A);

        try {

            document.body.innerHTML = '<test-a type="d"></test-a>"';

            expect(true).toBeFalsy(); // It should never reach here
        }
        catch (error) {

            expect((error as Error).message).toBe("Value: 'd' is not part of the options: [a, b, c]");
        }
    });

    // it('should throw an error when a property is required but there is not a value provided when the custom element is created', () => {

    //     class A extends CustomElement {

    //         static get properties(): Record<string, CustomElementPropertyMetadata> {

    //             return {

    //                 type: {
    //                     type: DataTypes.String,
    //                     // value: "a", Do not provide a default value to enforce required
    //                     required: true
    //                 }
    //             };
    //         }

    //         render(): null {

    //             return null;
    //         }
    //     }

    //     defineCustomElement('test-a', A);

    //     try {

    //         document.body.innerHTML = '<test-a></test-a>';

    //         expect(true).toBeFalsy(); // It should never reach here
    //     }
    //     catch (error) {

    //         expect((error as Error).message).toBe("The attributes: [type] must have a value");
    //     }
    // });

    it('should throw an error when a attribute is not defined but assigned anyway', () => {

        class A extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    type: {
                        type: DataTypes.String,
                        value: "a",
                        required: true
                    }
                };
            }

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-a', A);

        try {

            document.body.innerHTML = '<test-a></test-a>';

            const component = document.querySelector('test-a') as CustomElement;

            component._setAttribute('inexistent', '28');

            expect(true).toBeFalsy(); // It should never reach here
        }
        catch (error) {

            expect((error as Error).message).toBe("Attribute: 'inexistent' is not configured for custom element: 'A'");
        }
    });

    it('should throw an error when a property is not defined but assigned anyway', () => {

        class A extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    type: {
                        type: DataTypes.String,
                        value: "a",
                        required: true
                    }
                };
            }

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-a', A);

        try {

            document.body.innerHTML = '<test-a></test-a>';

            const component = document.querySelector('test-a') as CustomElement;

            component.setProperty('inexistent', 38);

            expect(true).toBeFalsy(); // It should never reach here
        }
        catch (error) {

            expect((error as Error).message).toBe("Property: 'inexistent' is not configured for custom element: 'A'");
        }
    });

    it('should call the "standard" propertyChanged callback when set', async () => {

        class A extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    type: {
                        type: DataTypes.String,
                        value: "a",
                        required: true
                    }
                };
            }

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-a', A);

        (window as unknown as { showPropertyChanged: (name: string, value: unknown) => string }).showPropertyChanged =
            (name: string, value: unknown) => `Property has changed: name: '${name}' value: '${value}'`;

        // Attach it to the DOM
        document.body.innerHTML = '<test-a type="b" property-changed="showPropertyChanged()"></test-a>';

        // Test the element
        const component = document.querySelector('test-a') as CustomElement;

        const spyPropertyChanged = jest.spyOn(component, 'propertyChanged');

        await component.updateComplete;

        expect(spyPropertyChanged).toBeCalledTimes(1);
    });

    it('should have access to the attributes inside the constructor', () => {

        class A extends HTMLElement {

            constructor() {

                super();

                console.log(this.attributes.length);
            }
        }

        defineCustomElement('test-a', A);

        // Attach it to the DOM
        document.body.innerHTML = '<test-a type="b" property-changed="showPropertyChanged()"></test-a>';
    });
});
