import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import clearCustomElements from "../../test/custom-element/helpers/clearCustomElements";

beforeEach(() => {

    clearCustomElements();
});

describe("CustomElement styles tests", () => {

    it('should have the styles as undefined if no styles were defined', () => {

        class A extends CustomElement {

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-a', A);

        expect(A.metadata.styles).toEqual(undefined);     
    });

    it('should populate a single style', () => {

        class A extends CustomElement {

            static get styles(): string {

                return "div { color: red; }";
            }

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-a', A);

        expect(A.metadata.styles).toEqual("div { color: red; }");     
    });

    it('should populate a several styles', () => {

        class A extends CustomElement {

            static get styles(): string {

                return mergeStyles(
                    'div { color: red; }',
                    'span { display: inline-block; }'
                );
            }

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-a', A);

        expect(A.metadata.styles).toEqual(
`div { color: red; }

span { display: inline-block; }`
        );     
    });

    it('should not inherit the styles of the base custom element by default', () => {

        class A extends CustomElement {

            static get styles(): string {

                return "div { color: red; }";
            }

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-a', A);

        class B extends A {

            static get styles(): string {

                return "span { display: inline-block; }";

            }
        }

        defineCustomElement('test-b', B);

        // Only the style of class B is set by default
        expect(B.metadata.styles).toEqual("span { display: inline-block; }");
    });

    it('should allow to include the styles of the base custom element', () => {

        class A extends CustomElement {

            static get styles(): string {

                return "div { color: red; }";
            }

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-a', A);

        class B extends A {

            static get styles(): string {

                return mergeStyles(
                    super.styles,
                    "span { display: inline-block; }"
                );
            }
        }

        defineCustomElement('test-b', B);

        expect(B.metadata.styles).toEqual(
`div { color: red; }

span { display: inline-block; }`
        );
    });

    it('should handle the undefined style of the base custom element', () => {

        class A extends CustomElement {

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-a', A);

        class B extends A {

            static get styles(): string {

                return mergeStyles(
                    super.styles,
                    "span { display: inline-block; }"
                );
            }
        }

        defineCustomElement('test-b', B);

        expect(B.metadata.styles).toEqual("span { display: inline-block; }");
    });
});