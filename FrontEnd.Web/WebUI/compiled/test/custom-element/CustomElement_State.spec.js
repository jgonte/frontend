import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import clearCustomElements from "../../test/custom-element/helpers/clearCustomElements";
beforeEach(() => {
    clearCustomElements();
});
describe("CustomElement state tests", () => {
    it('should set the default state value', () => {
        class A extends CustomElement {
            static get state() {
                return {
                    type: {
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
        component.type = 'a';
        expect(component.type).toBe('a');
    });
    it('should set the state values of the derived class', () => {
        class A extends CustomElement {
            static get state() {
                return {
                    baseState: {
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
            static get state() {
                return {
                    derivedState: {
                        value: 26
                    }
                };
            }
        }
        defineCustomElement('test-b', B);
        document.body.innerHTML = "<test-b></test-b>";
        const component = document.querySelector('test-b');
        expect(component.baseState).toBe(13);
        expect(component.derivedState).toBe(26);
    });
    it('should set the state values of the mixed-in class', () => {
        class A extends CustomElement {
            static get state() {
                return {
                    baseState: {
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
                static get state() {
                    {
                        return {
                            derivedState: {
                                value: 26
                            }
                        };
                    }
                }
            };
        }
        class B extends Mixin(A) {
        }
        defineCustomElement('test-b', B);
        document.body.innerHTML = "<test-b></test-b>";
        const component = document.querySelector('test-b');
        expect(component.baseState).toBe(13);
        expect(component.derivedState).toBe(26);
    });
    it('should throw an error when state is set to a value that does not corresponds the options', () => {
        class A extends CustomElement {
            static get state() {
                return {
                    type: {
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
        document.body.innerHTML = '<test-a></test-a>';
        try {
            const component = document.querySelector('test-a');
            component.type = 'd';
            expect(true).toBeFalsy();
        }
        catch (error) {
            expect(error.message).toBe("Value: 'd' is not part of the options: [a, b, c]");
        }
    });
    it('should throw an error when a attribute is not defined but assigned anyway', () => {
        class A extends CustomElement {
            render() {
                return null;
            }
        }
        defineCustomElement('test-a', A);
        try {
            document.body.innerHTML = '<test-a></test-a>';
            const component = document.querySelector('test-a');
            component._setState('inexistent', '28');
            expect(true).toBeFalsy();
        }
        catch (error) {
            expect(error.message).toBe("There is no configured property for state: 'inexistent' in type: 'A'");
        }
    });
});
//# sourceMappingURL=CustomElement_State.spec.js.map