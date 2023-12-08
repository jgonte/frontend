import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import html from "../../rendering/html";
import clearCustomElements from "../../test/custom-element/helpers/clearCustomElements";
import { DataTypes } from "../../utils/data/DataTypes";
beforeEach(() => {
    clearCustomElements();
});
describe("CustomElement properties tests", () => {
    it('should set the default property value', () => {
        class A extends CustomElement {
            static get properties() {
                return {
                    type: {
                        type: DataTypes.String,
                        value: "a"
                    }
                };
            }
            render() {
                return null;
            }
        }
        defineCustomElement('test-a', A);
        document.body.innerHTML = '<test-a></test-a>';
        const component = document.querySelector('test-a');
        expect(component.type).toBe('a');
        component.setAttribute('type', 'a');
        expect(component.type).toBe('a');
        const metadata = component.constructor.metadata;
        expect(metadata.properties.size).toEqual(1);
    });
    it('should populate a property from a value from a function', () => {
        class A extends CustomElement {
            static get properties() {
                return {
                    type: {
                        type: DataTypes.Function
                    }
                };
            }
            render() {
                return null;
            }
        }
        defineCustomElement('test-a', A);
        window.getType = () => "a";
        document.body.innerHTML = '<test-a type="getType()"></test-a>';
        const component = document.querySelector('test-a');
        expect(component.type).toBe('a');
    });
    it('should populate a boolean property', () => {
        class A extends CustomElement {
            static get properties() {
                return {
                    simple: {
                        type: DataTypes.Boolean,
                        reflect: true
                    }
                };
            }
            render() {
                return null;
            }
        }
        defineCustomElement('test-a', A);
        document.body.innerHTML = '<test-a simple></test-a>';
        const component = document.querySelector('test-a');
        expect(component.simple).toBe(true);
        component.simple = false;
        expect(component.outerHTML).toBe('<test-a></test-a>');
        component.simple = true;
        expect(component.outerHTML).toBe('<test-a simple=""></test-a>');
    });
    it('should populate an object property', () => {
        class A extends CustomElement {
            static get properties() {
                return {
                    simple: {
                        type: DataTypes.Object,
                        reflect: true
                    }
                };
            }
            render() {
                return null;
            }
        }
        defineCustomElement('test-a', A);
        document.body.innerHTML = '<test-a></test-a>';
        const component = document.querySelector('test-a');
        component.simple = { is: true };
        expect(component.outerHTML).toBe("<test-a simple=\"{&quot;is&quot;:true}\"></test-a>");
    });
    it('should throw an error when the attribute is bad-formed JSON', () => {
        class A extends CustomElement {
            static get properties() {
                return {
                    type: {
                        type: DataTypes.Object
                    }
                };
            }
            render() {
                return null;
            }
        }
        defineCustomElement('test-a', A);
        try {
            document.body.innerHTML = '<test-a type="{ e = 1 }"></test-a>';
            expect(true).toBeFalsy();
        }
        catch (error) {
            expect(error.message).toBe("Unexpected token e in JSON at position 2");
        }
    });
    it('should throw an error when the attribute is an object but the expected type is an array', () => {
        class A extends CustomElement {
            static get properties() {
                return {
                    type: {
                        type: DataTypes.Array
                    }
                };
            }
            render() {
                return null;
            }
        }
        defineCustomElement('test-a', A);
        try {
            document.body.innerHTML = `<test-a type='{ "e":1 }'></test-a>`;
            expect(true).toBeFalsy();
        }
        catch (error) {
            expect(error.message).toBe("value: { \"e\":1 } is not an array but there is no object type expected");
        }
    });
    it('should throw an error when the attribute is an array but the expected type is an object', () => {
        class A extends CustomElement {
            static get properties() {
                return {
                    type: {
                        type: DataTypes.Object
                    }
                };
            }
            render() {
                return null;
            }
        }
        defineCustomElement('test-a', A);
        try {
            document.body.innerHTML = `<test-a type='[{ "e":1 }]'></test-a>`;
            expect(true).toBeFalsy();
        }
        catch (error) {
            expect(error.message).toBe("value: [{ \"e\":1 }] is an array but there is no array type expected");
        }
    });
    it('should reflect a property change in its attribute', () => {
        class A extends CustomElement {
            static get properties() {
                return {
                    type: {
                        type: DataTypes.String,
                        value: "a",
                        reflect: true
                    }
                };
            }
            render() {
                return null;
            }
        }
        defineCustomElement('test-a', A);
        document.body.innerHTML = '<test-a></test-a>';
        const component = document.querySelector('test-a');
        expect(component.type).toBe('a');
        component.setAttribute('type', 'a');
        expect(component.type).toBe('a');
        component.type = "b";
        expect(component.outerHTML).toEqual("<test-a type=\"b\"></test-a>");
    });
    it('should reflect a property change in its attribute when set to null', () => {
        class A extends CustomElement {
            static get properties() {
                return {
                    type: {
                        type: DataTypes.String,
                        value: "a",
                        reflect: true
                    }
                };
            }
            render() {
                return null;
            }
        }
        defineCustomElement('test-a', A);
        document.body.innerHTML = '<test-a></test-a>';
        const component = document.querySelector('test-a');
        expect(component.type).toBe('a');
        component.setAttribute('type', 'a');
        expect(component.type).toBe('a');
        component.type = null;
        expect(component.outerHTML).toEqual("<test-a></test-a>");
    });
    it('should transform a property before setting it', () => {
        class A extends CustomElement {
            static get properties() {
                return {
                    type: {
                        type: DataTypes.Number,
                        beforeSet: v => 2 * v
                    }
                };
            }
            render() {
                return null;
            }
        }
        defineCustomElement('test-a', A);
        document.body.innerHTML = '<test-a type="13"></test-a>';
        const component = document.querySelector('test-a');
        expect(component.type).toBe(26);
    });
    it('should call the afterUpdate method of the property after mounting/updating the element', async () => {
        const callTester = {
            refreshType(type) {
                console.log(type);
            }
        };
        class A extends CustomElement {
            static get properties() {
                return {
                    type: {
                        type: DataTypes.String,
                        value: "a",
                        afterUpdate: function () {
                            callTester.refreshType(this.type);
                        }
                    }
                };
            }
            render() {
                return html `<span>My type is: '${this.type}'</span>`;
            }
        }
        const spyRefreshType = jest.spyOn(callTester, 'refreshType');
        defineCustomElement('test-a', A);
        document.body.innerHTML = '<test-a type="a"></test-a>';
        const component = document.querySelector('test-a');
        await component.updateComplete;
        expect(component.type).toBe("a");
        expect(spyRefreshType).toHaveBeenNthCalledWith(1, "a");
    });
    it('should set the property value to a function', () => {
        class A extends CustomElement {
            static get properties() {
                return {
                    type: {
                        type: DataTypes.Function,
                        value: () => 5
                    }
                };
            }
            render() {
                return null;
            }
        }
        defineCustomElement('test-a', A);
        document.body.innerHTML = '<test-a></test-a>';
        const component = document.querySelector('test-a');
        expect(component.type).toBe(5);
    });
    it('should set the property values of the derived class', () => {
        class A extends CustomElement {
            static get properties() {
                return {
                    baseProp: {
                        attribute: "base-prop",
                        type: DataTypes.Number,
                        value: 13
                    }
                };
            }
            render() {
                return null;
            }
        }
        defineCustomElement('test-a', A);
        class B extends A {
            static get properties() {
                return {
                    derivedProp: {
                        attribute: "derived-prop",
                        type: DataTypes.Number,
                        value: 26
                    }
                };
            }
            render() {
                return null;
            }
        }
        defineCustomElement('test-b', B);
        document.body.innerHTML = "<test-b></test-b>";
        const component = document.querySelector('test-b');
        expect(component.baseProp).toBe(13);
        expect(component.derivedProp).toBe(26);
    });
    it('should set the property values of the mixed-in class', () => {
        class A extends CustomElement {
            static get properties() {
                return {
                    baseProp: {
                        attribute: "base-prop",
                        type: DataTypes.Number,
                        value: 13
                    }
                };
            }
            render() {
                return null;
            }
        }
        defineCustomElement('test-a', A);
        function Mixin(Base) {
            return class AMixin extends Base {
                static get properties() {
                    return {
                        derivedProp: {
                            attribute: "derived-prop",
                            type: DataTypes.Number,
                            value: 26
                        }
                    };
                }
            };
        }
        class B extends Mixin(A) {
        }
        defineCustomElement('test-b', B);
        document.body.innerHTML = "<test-b></test-b>";
        const component = document.querySelector('test-b');
        expect(component.baseProp).toBe(13);
        expect(component.derivedProp).toBe(26);
    });
    it('should throw an error when the attribute does not correspond to the options', () => {
        class A extends CustomElement {
            static get properties() {
                return {
                    type: {
                        type: DataTypes.String,
                        value: "a",
                        options: ["a", "b", "c"]
                    }
                };
            }
            render() {
                return null;
            }
        }
        defineCustomElement('test-a', A);
        try {
            document.body.innerHTML = '<test-a type="d"></test-a>"';
            expect(true).toBeFalsy();
        }
        catch (error) {
            expect(error.message).toBe("Value: 'd' is not part of the options: [a, b, c]");
        }
    });
    it('should throw an error when a attribute is not defined but assigned anyway', () => {
        class A extends CustomElement {
            static get properties() {
                return {
                    type: {
                        type: DataTypes.String,
                        value: "a",
                        required: true
                    }
                };
            }
            render() {
                return null;
            }
        }
        defineCustomElement('test-a', A);
        try {
            document.body.innerHTML = '<test-a></test-a>';
            const component = document.querySelector('test-a');
            component._setAttribute('inexistent', '28');
            expect(true).toBeFalsy();
        }
        catch (error) {
            expect(error.message).toBe("Attribute: 'inexistent' is not configured for custom element: 'A'");
        }
    });
    it('should throw an error when a property is not defined but assigned anyway', () => {
        class A extends CustomElement {
            static get properties() {
                return {
                    type: {
                        type: DataTypes.String,
                        value: "a",
                        required: true
                    }
                };
            }
            render() {
                return null;
            }
        }
        defineCustomElement('test-a', A);
        try {
            document.body.innerHTML = '<test-a></test-a>';
            const component = document.querySelector('test-a');
            component.setProperty('inexistent', 38);
            expect(true).toBeFalsy();
        }
        catch (error) {
            expect(error.message).toBe("Property: 'inexistent' is not configured for custom element: 'A'");
        }
    });
    it('should call the "standard" propertyChanged callback when set', async () => {
        class A extends CustomElement {
            static get properties() {
                return {
                    type: {
                        type: DataTypes.String,
                        value: "a",
                        required: true
                    }
                };
            }
            render() {
                return null;
            }
        }
        defineCustomElement('test-a', A);
        window.showPropertyChanged =
            (name, value) => `Property has changed: name: '${name}' value: '${value}'`;
        document.body.innerHTML = '<test-a type="b" property-changed="showPropertyChanged()"></test-a>';
        const component = document.querySelector('test-a');
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
        document.body.innerHTML = '<test-a type="b" property-changed="showPropertyChanged()"></test-a>';
    });
});
//# sourceMappingURL=CustomElement_Properties.spec.js.map