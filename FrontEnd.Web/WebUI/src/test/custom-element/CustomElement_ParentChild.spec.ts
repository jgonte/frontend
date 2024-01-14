import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import clearCustomElements from "./helpers/clearCustomElements";
import { DataTypes } from "../../utils/data/DataTypes";

beforeEach(() => {

    clearCustomElements();
});

describe("CustomElement parent children relationship tests", () => {

    it('should call the child didMountCallback before the parent', async () => {

        const callTester = {

            didMountCallback: (element: HTMLElement) => {

                console.log(element.constructor.name);
            }
        };

        class Parent extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    name: {
                        type: DataTypes.String,
                        value: "Sarah"
                    }
                };
            }

            static get styles(): string {

                return `
                    :host {
                        background-color: yellowgreen;
                    }
                `;
            }

            render(): NodePatchingData {

                return html`
                    <span>Hello, my name is ${this.name}</span>
                `;
            }

            didMountCallback() {

                callTester.didMountCallback(this); // Parent
            }
        }

        defineCustomElement('test-parent', Parent);

        class Child extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    age: {
                        type: DataTypes.Number,
                        value: 19
                    }
                };
            }

            static get styles(): string {

                return `
                    :host {
                        background-color: aliceblue
                    }
                `;
            }

            render(): NodePatchingData {

                return html`
                    <span>My age is ${this.age}</span>
                `;
            }

            didMountCallback() {

                callTester.didMountCallback(this); // Child
            }
        }

        const spyMountedCallback = jest.spyOn(callTester, 'didMountCallback');

        defineCustomElement('test-child', Child);

        // Attach it to the DOM
        document.body.innerHTML =
            `
            <test-parent>
                <test-child></test-child>
            </test-parent>
        `;

        // Test the element
        const parent = document.querySelector('test-parent') as CustomElement;

        await parent.updateComplete; // Wait for the component to render

        const child = document.querySelector('test-child') as CustomElement;

        //await childComponent.updateComplete; // The parent waits for the child to mount/update

        expect(parent.adoptedChildren.size).toEqual(1);

        expect(Array.from(parent.adoptedChildren)[0]).toBe(child);

        expect(spyMountedCallback).toHaveBeenCalledTimes(2);

        expect(spyMountedCallback).toHaveBeenNthCalledWith(1, child); // Children should be called first

        expect(spyMountedCallback).toHaveBeenNthCalledWith(2, parent);
    });

    it('should call the child didMountCallback before the slotted parent', async () => {

        const callTester = {

            didMountCallback: (element: HTMLElement) => {

                console.log(element.constructor.name);
            }
        };

        class Parent extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    name: {
                        type: DataTypes.String,
                        value: "Sarah"
                    }
                };
            }

            static get styles(): string {

                return `
                    :host {
                        background-color: yellowgreen;
                    }
                `;
            }

            render(): NodePatchingData {

                return html`
                    <slot name="content"></slot>
                `;
            }

            didMountCallback() {

                callTester.didMountCallback(this); // Slotted parent
            }
        }

        defineCustomElement('test-parent', Parent);

        class Child extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    age: {
                        type: DataTypes.Number,
                        value: 19
                    }
                };
            }

            static get styles(): string {

                return `
                    :host {
                        background-color: aliceblue
                    }
                `;
            }

            render(): NodePatchingData {

                return html`
                    <span>My age is ${this.age}</span>
                `;
            }

            didMountCallback() {

                callTester.didMountCallback(this); // Slotted child
            }
        }

        const spyMountedCallback = jest.spyOn(callTester, 'didMountCallback');

        defineCustomElement('test-child', Child);

        // Attach it to the DOM
        document.body.innerHTML =
            `
            <test-parent>
                <test-child slot="content"></test-child>
            </test-parent>
        `;

        // Test the element
        const parent = document.querySelector('test-parent') as CustomElement;

        await parent.updateComplete; // Wait for the component to render

        const child = document.querySelector('test-child') as CustomElement;

        //await childComponent.updateComplete; // The parent waits for the child to mount/update

        expect(parent.adoptedChildren.size).toEqual(1);

        expect(Array.from(parent.adoptedChildren)[0]).toBe(child);

        expect(spyMountedCallback).toHaveBeenCalledTimes(2);

        expect(spyMountedCallback).toHaveBeenNthCalledWith(1, child); // Children should be called first

        expect(spyMountedCallback).toHaveBeenNthCalledWith(2, parent);
    });

    it('should set the inherited property if the property of the child has not been explicitly set', async () => {

        class Parent extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    size: {
                        type: DataTypes.String,
                        value: "medium",
                        options: ["small", "medium", "large"]
                    }
                };
            }

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-parent', Parent);

        class Child extends CustomElement {

            render(): NodePatchingData {

                return html`
                    <span>My size is ${this.size}</span>
                `;
            }
        }

        defineCustomElement('test-child', Child);

        class GrandChild extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    size: {
                        type: DataTypes.String,
                        value: "medium",
                        options: ["small", "medium", "large"],
                        inherit: true
                    }
                };
            }

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-grand-child', GrandChild);

        // Attach it to the DOM
        document.body.innerHTML = `<test-parent size="large">
            <test-child>
                <test-grand-child></test-grand-child>
            </test-child>
        </test-parent>`;

        // Test the element
        const parent = document.querySelector('test-parent') as CustomElement;

        await parent.updateComplete; // Wait for the component to render

        const grandChild = document.querySelector('test-grand-child') as CustomElement;

        //await childComponent.updateComplete; // The parent waits for the child to mount/update

        expect(parent.adoptedChildren.size).toEqual(1);

        expect(parent.size).toBe('large');

        expect(grandChild.size).toBe('large'); // Inherited
    });

    it('should set the inherited property if the property of the child has not been explicitly set passing through a slot', async () => {

        class Parent extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    size: {
                        type: DataTypes.String,
                        value: "medium",
                        options: ["small", "medium", "large"]
                    }
                };
            }

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-parent', Parent);

        class Child extends CustomElement {

            render(): NodePatchingData {

                return html`<slot></slot>`;
            }
        }

        defineCustomElement('test-child', Child);

        class GrandChild extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    size: {
                        type: DataTypes.String,
                        value: "medium",
                        options: ["small", "medium", "large"],
                        inherit: true
                    }
                };
            }

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-grand-child', GrandChild);

        // Attach it to the DOM
        document.body.innerHTML = `<test-parent size="large">
            <test-child>
                <test-grand-child></test-grand-child>
            </test-child>
        </test-parent>`;

        // Test the element
        const parent = document.querySelector('test-parent') as CustomElement;

        await parent.updateComplete; // Wait for the component to render

        const grandChild = document.querySelector('test-grand-child') as CustomElement;

        //await childComponent.updateComplete; // The parent waits for the child to mount/update

        expect(parent.adoptedChildren.size).toEqual(1);

        expect(parent.size).toBe('large');

        expect(grandChild.size).toBe('large'); // Inherited
    });
    
    it('should not set the property of the grand child if the parent with the inheritable property is not found', async () => {

        class Parent extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    size: {
                        type: DataTypes.String,
                        // value: "medium", If this value is set, then it will be set as property and the grand child will inherit it
                        options: ["small", "medium", "large"]
                    }
                };
            }

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-parent', Parent);

        class Child extends CustomElement {

            render(): NodePatchingData {

                return html`
                    <span>My size is ${this.size}</span>
                `;
            }
        }

        defineCustomElement('test-child', Child);

        class GrandChild extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    size: {
                        type: DataTypes.String,
                        options: ["small", "medium", "large"],
                        inherit: true
                    }
                };
            }

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-grand-child', GrandChild);

        // Attach it to the DOM
        document.body.innerHTML = `<test-parent>
            <test-child>
                <test-grand-child></test-grand-child>
            </test-child>
        </test-parent>`;

        // Test the element
        const parent = document.querySelector('test-parent') as CustomElement;

        await parent.updateComplete; // Wait for the component to render

        const grandChild = document.querySelector('test-grand-child') as CustomElement;

        //await childComponent.updateComplete; // The parent waits for the child to mount/update

        expect(parent.adoptedChildren.size).toEqual(1);

        expect(parent.size).toBe(undefined);

        expect(grandChild.size).toBe(undefined); // Not set
    });

    it('should not set the inherited property if the property of the child has been explicitly set', async () => {

        class Parent extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    size: {
                        type: DataTypes.String,
                        value: "medium",
                        options: ["small", "medium", "large"]
                    }
                };
            }

            render(): NodePatchingData {

                return html`
                    <span>Hello!</span>
                `;
            }
        }

        defineCustomElement('test-parent', Parent);

        class Child extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    size: {
                        type: DataTypes.String,
                        value: "medium",
                        options: ["small", "medium", "large"],
                        inherit: true
                    }
                };
            }

            render(): NodePatchingData {

                return html`
                    <span>My size is ${this.size}</span>
                `;
            }
        }

        defineCustomElement('test-child', Child);

        // Attach it to the DOM
        document.body.innerHTML = `<test-parent size="large">
            <test-child size="small"></test-child>
        </test-parent>`;

        // Test the element
        const parent = document.querySelector('test-parent') as CustomElement;

        await parent.updateComplete; // Wait for the component to render

        const child = document.querySelector('test-child') as CustomElement;

        //await childComponent.updateComplete; // The parent waits for the child to mount/update

        expect(parent.adoptedChildren.size).toEqual(1);

        expect(Array.from(parent.adoptedChildren)[0]).toBe(child);

        expect(parent.size).toBe('large');

        expect(child.size).toBe('small'); // Do not inherit but use the value set for the child
    });

    it('should allow adding, replacing and removing children as parent attributes', async () => {

        class Parent extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    name: {
                        type: DataTypes.String,
                        required: true
                    },

                    kids: {
                        type: DataTypes.Array,
                        value: []
                    }
                };
            }

            render(): NodePatchingData | NodePatchingData[] | null {

                return html`<div>
                    <span>Hello, my name is ${this.name}</span>
                    ${this.renderChildren()}
                </div>`;
            }

            renderChildren(): NodePatchingData | NodePatchingData[] | null {

                return Array.from(this.kids).map(child => html`<test-child name=${(child as Parent).name} age=${(child as Parent).age}></test-child>`) as NodePatchingData[];
            }
        }

        defineCustomElement('test-parent', Parent);

        class Child extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    name: {
                        type: DataTypes.String,
                        required: true
                    },

                    age: {
                        type: DataTypes.Number,
                        required: true
                    }
                };
            }

            render(): NodePatchingData {

                return html`<div class="child">
                    <span>My name is: {this.name}</span>
                    <span>My age is: {this.age}</span>
                </div>`;
            }
        }

        defineCustomElement('test-child', Child);

        // Attach it to the DOM
        document.body.innerHTML = `<test-parent name="Jorge" kids='[
            {
                "name":"Sarah",
                "age":"20"
            },
            {
                "name":"Mark",
                "age":"30"
            }
        ]'>
        </test-parent>`;

        // Test the element
        const parent = document.querySelector('test-parent') as CustomElement;

        await parent.updateComplete; // Wait for the component to render

        expect(parent.shadowRoot?.innerHTML).toEqual("<div>\n                    <span>Hello, my name is <!--_$bm_-->Jorge<!--_$em_--></span><!--_$bm_--><test-child name=\"Sarah\" age=\"20\"></test-child><test-child name=\"Mark\" age=\"30\"></test-child><!--_$em_--></div>");

        parent.kids = [
            {
                name: "Mark",
                age: 30
            },
            {
                name: "Sarah",
                age: 20
            }
        ];

        await parent.updateComplete; // Wait for the component to render

        expect(parent.shadowRoot?.innerHTML).toEqual("<div>\n                    <span>Hello, my name is <!--_$bm_-->Jorge<!--_$em_--></span><!--_$bm_--><test-child name=\"Mark\" age=\"30\"></test-child><test-child name=\"Sarah\" age=\"20\"></test-child><!--_$em_--></div>");

        parent.kids = []; // Remove the children

        await parent.updateComplete; // Wait for the component to render

        expect(parent.shadowRoot?.innerHTML).toEqual("<div>\n                    <span>Hello, my name is <!--_$bm_-->Jorge<!--_$em_--></span><!--_$bm_--><!--_$em_--></div>");

    });

    it('should allow adding, replacing and removing slotted elements', async () => {

        const callTester = {

            parentAdoptedChildCallback(child: HTMLElement) {

                console.log(child.constructor.name);
            }
        };

        class Parent extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    name: {
                        type: DataTypes.String,
                        required: true
                    }
                };
            }

            render(): NodePatchingData | NodePatchingData[] | null {

                return html`<div>
                    <span>Hello, my name is ${this.name}</span>
                    <slot></slot>
                </div>`;
            }

            parentAdoptedChildCallback(child: HTMLElement) {

                callTester.parentAdoptedChildCallback(child);
            }
        }

        const spyDidAdoptChildrenCallback = jest.spyOn(callTester, 'parentAdoptedChildCallback');

        defineCustomElement('test-parent', Parent);

        class Child extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    name: {
                        type: DataTypes.String,
                        required: true
                    },

                    age: {
                        type: DataTypes.Number,
                        required: true
                    }
                };
            }

            render(): NodePatchingData {

                return html`<div class="child">
                    <span>My name is: {this.name}</span>
                    <span>My age is: {this.age}</span>
                </div>`;
            }
        }

        defineCustomElement('test-child', Child);
    
        // Attach it to the DOM
        document.body.innerHTML = `<test-parent name="Jorge">
            <test-child name="Sarah" age="20"></test-child>
            <test-child name="Mark" age="30"></test-child>
        </test-parent>`;

        // Test the element
        const parent = document.querySelector('test-parent') as CustomElement;

        await parent.updateComplete; // Wait for the component to render

        expect(parent.shadowRoot?.innerHTML).toEqual("<div>\n                    <span>Hello, my name is <!--_$bm_-->Jorge<!--_$em_--></span>\n                    <slot></slot>\n                </div>");

        expect(spyDidAdoptChildrenCallback).toBeCalledTimes(2);

    });

    it('should allow adding, replacing and removing children as slotted elements', async () => {

        class Parent extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    name: {
                        type: DataTypes.String,
                        required: true
                    }
                };
            }

            render(): NodePatchingData | NodePatchingData[] | null {

                return html`<div>
                    <span>Hello, my name is ${this.name}</span>
                    <slot></slot>
                </div>`;
            }
        }

        defineCustomElement('test-parent', Parent);

        class Child extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    name: {
                        type: DataTypes.String,
                        required: true
                    },

                    age: {
                        type: DataTypes.Number,
                        required: true
                    }
                };
            }

            render(): NodePatchingData {

                return html`<div class="child">
                    <span>My name is: {this.name}</span>
                    <span>My age is: {this.age}</span>
                </div>`;
            }
        }

        defineCustomElement('test-child', Child);

        class Container extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    child: {
                        type: [
                            DataTypes.Object,
                            DataTypes.Function
                        ]
                    }
                };
            }

            render(): NodePatchingData | NodePatchingData[] | null {

                return html`<div class="container">
                    ${this.child}
                </div>`;
            }
        }

        defineCustomElement('test-container', Container);
        
        // Attach it to the DOM
        document.body.innerHTML = `<test-container></test-container>`;

        // Test the element
        const container = document.querySelector('test-container') as CustomElement;

        await container.updateComplete; // Wait for the component to render

        expect(container.shadowRoot?.innerHTML).toEqual("<div class=\"container\"><!--_$bm_--><!--_$em_--></div>");

        container.child = html`<test-parent name="Jorge">
            <test-child name="Sarah" age="20"></test-child>
            <test-child name="Mark" age="30"></test-child>
        </test-parent>`;

        await container.updateComplete; // Wait for the component to render

        expect(container.shadowRoot?.innerHTML).toEqual("<div class=\"container\"><!--_$bm_--><test-parent name=\"Jorge\">\n            <test-child name=\"Sarah\" age=\"20\"></test-child>\n            <test-child name=\"Mark\" age=\"30\"></test-child>\n        </test-parent><!--_$em_--></div>");

        container.child = null; // Remove the child

        await container.updateComplete; // Wait for the component to render

        expect(container.shadowRoot?.innerHTML).toEqual("<div class=\"container\"><!--_$bm_--><!--_$em_--></div>");

    });
});
