import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementStateMetadata from "../../custom-element/mixins/metadata/types/CustomElementStateMetadata";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import clearCustomElements from "../../test/custom-element/helpers/clearCustomElements";

beforeEach(() => {

    clearCustomElements();
});

describe("CustomElement state tests", () => {

    it('should set the default state value', () => {

        class A extends CustomElement {

            static get state(): Record<string, CustomElementStateMetadata> {

                return {

                    type: {
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

        // Set the same state
        component.type = 'a';

        expect(component.type).toBe('a');
    });

    it('should set the state values of the derived class', () => {

        class A extends CustomElement {

            static get state(): Record<string, CustomElementStateMetadata> {

                return {

                    baseState: {
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

            static get state(): Record<string, CustomElementStateMetadata> {

                return {

                    derivedState: {
                        value: 26
                    }
                };
            }
        }

        defineCustomElement('test-b', B);

        // Attach it to the DOM
        document.body.innerHTML = "<test-b></test-b>";

        // Test the element
        const component = document.querySelector('test-b') as CustomElement;

        expect(component.baseState).toBe(13);

        expect(component.derivedState).toBe(26);
    });

    it('should set the state values of the mixed-in class', () => {

        class A extends CustomElement {

            static get state(): Record<string, CustomElementStateMetadata> {

                return {

                    baseState: {
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

                static get state(): Record<string, CustomElementStateMetadata> {
                    {

                        return {

                            derivedState: {
                                value: 26
                            }
                        };
                    }
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

        expect(component.baseState).toBe(13);

        expect(component.derivedState).toBe(26);
    });

    it('should throw an error when state is set to a value that does not corresponds the options', () => {

        class A extends CustomElement {

            static get state(): Record<string, CustomElementStateMetadata> {

                return {

                    type: {
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

        document.body.innerHTML = '<test-a></test-a>';

        try {
            // Test the element
            const component = document.querySelector('test-a') as CustomElement;

            component.type = 'd'; // 'd' is not in the options

            expect(true).toBeFalsy(); // It should never reach here
        }
        catch (error) {

            expect((error as Error).message).toBe("Value: 'd' is not part of the options: [a, b, c]");
        }
    });

    it('should throw an error when a attribute is not defined but assigned anyway', () => {

        class A extends CustomElement {

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-a', A);

        try {

            document.body.innerHTML = '<test-a></test-a>';

            const component = document.querySelector('test-a') as CustomElement;

            component._setState('inexistent', '28');

            expect(true).toBeFalsy(); // It should never reach here
        }
        catch (error) {

            expect((error as Error).message).toBe("There is no configured property for state: 'inexistent' in type: 'A'");
        }
    });
});