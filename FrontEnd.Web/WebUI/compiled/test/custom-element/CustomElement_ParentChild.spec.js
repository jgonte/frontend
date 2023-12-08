import html from "../../rendering/html";
import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import clearCustomElements from "./helpers/clearCustomElements";
import { DataTypes } from "../../utils/data/DataTypes";
beforeEach(() => {
    clearCustomElements();
});
describe("CustomElement parent children relationship tests", () => {
    it('should call the child didMountCallback before the parent', async () => {
        const callTester = {
            didMountCallback: (element) => {
                console.log(element.constructor.name);
            }
        };
        class Parent extends CustomElement {
            static get properties() {
                return {
                    name: {
                        type: DataTypes.String,
                        value: "Sarah"
                    }
                };
            }
            static get styles() {
                return `
                    :host {
                        background-color: yellowgreen;
                    }
                `;
            }
            render() {
                return html `
                    <span>Hello, my name is ${this.name}</span>
                `;
            }
            didMountCallback() {
                callTester.didMountCallback(this);
            }
        }
        defineCustomElement('test-parent', Parent);
        class Child extends CustomElement {
            static get properties() {
                return {
                    age: {
                        type: DataTypes.Number,
                        value: 19
                    }
                };
            }
            static get styles() {
                return `
                    :host {
                        background-color: aliceblue
                    }
                `;
            }
            render() {
                return html `
                    <span>My age is ${this.age}</span>
                `;
            }
            didMountCallback() {
                callTester.didMountCallback(this);
            }
        }
        const spyMountedCallback = jest.spyOn(callTester, 'didMountCallback');
        defineCustomElement('test-child', Child);
        document.body.innerHTML =
            `
            <test-parent>
                <test-child></test-child>
            </test-parent>
        `;
        const parent = document.querySelector('test-parent');
        await parent.updateComplete;
        const child = document.querySelector('test-child');
        expect(parent.adoptedChildren.size).toEqual(1);
        expect(Array.from(parent.adoptedChildren)[0]).toBe(child);
        expect(spyMountedCallback).toHaveBeenCalledTimes(2);
        expect(spyMountedCallback).toHaveBeenNthCalledWith(1, child);
        expect(spyMountedCallback).toHaveBeenNthCalledWith(2, parent);
    });
    it('should call the child didMountCallback before the slotted parent', async () => {
        const callTester = {
            didMountCallback: (element) => {
                console.log(element.constructor.name);
            }
        };
        class Parent extends CustomElement {
            static get properties() {
                return {
                    name: {
                        type: DataTypes.String,
                        value: "Sarah"
                    }
                };
            }
            static get styles() {
                return `
                    :host {
                        background-color: yellowgreen;
                    }
                `;
            }
            render() {
                return html `
                    <slot name="content"></slot>
                `;
            }
            didMountCallback() {
                callTester.didMountCallback(this);
            }
        }
        defineCustomElement('test-parent', Parent);
        class Child extends CustomElement {
            static get properties() {
                return {
                    age: {
                        type: DataTypes.Number,
                        value: 19
                    }
                };
            }
            static get styles() {
                return `
                    :host {
                        background-color: aliceblue
                    }
                `;
            }
            render() {
                return html `
                    <span>My age is ${this.age}</span>
                `;
            }
            didMountCallback() {
                callTester.didMountCallback(this);
            }
        }
        const spyMountedCallback = jest.spyOn(callTester, 'didMountCallback');
        defineCustomElement('test-child', Child);
        document.body.innerHTML =
            `
            <test-parent>
                <test-child slot="content"></test-child>
            </test-parent>
        `;
        const parent = document.querySelector('test-parent');
        await parent.updateComplete;
        const child = document.querySelector('test-child');
        expect(parent.adoptedChildren.size).toEqual(1);
        expect(Array.from(parent.adoptedChildren)[0]).toBe(child);
        expect(spyMountedCallback).toHaveBeenCalledTimes(2);
        expect(spyMountedCallback).toHaveBeenNthCalledWith(1, child);
        expect(spyMountedCallback).toHaveBeenNthCalledWith(2, parent);
    });
    it('should set the inherited property if the property of the child has not been explicitly set', async () => {
        class Parent extends CustomElement {
            static get properties() {
                return {
                    size: {
                        type: DataTypes.String,
                        value: "medium",
                        options: ["small", "medium", "large"]
                    }
                };
            }
            render() {
                return null;
            }
        }
        defineCustomElement('test-parent', Parent);
        class Child extends CustomElement {
            render() {
                return html `
                    <span>My size is ${this.size}</span>
                `;
            }
        }
        defineCustomElement('test-child', Child);
        class GrandChild extends CustomElement {
            static get properties() {
                return {
                    size: {
                        type: DataTypes.String,
                        value: "medium",
                        options: ["small", "medium", "large"],
                        inherit: true
                    }
                };
            }
            render() {
                return null;
            }
        }
        defineCustomElement('test-grand-child', GrandChild);
        document.body.innerHTML = `<test-parent size="large">
            <test-child>
                <test-grand-child></test-grand-child>
            </test-child>
        </test-parent>`;
        const parent = document.querySelector('test-parent');
        await parent.updateComplete;
        const grandChild = document.querySelector('test-grand-child');
        expect(parent.adoptedChildren.size).toEqual(1);
        expect(parent.size).toBe('large');
        expect(grandChild.size).toBe('large');
    });
    it('should set the inherited property if the property of the child has not been explicitly set passing through a slot', async () => {
        class Parent extends CustomElement {
            static get properties() {
                return {
                    size: {
                        type: DataTypes.String,
                        value: "medium",
                        options: ["small", "medium", "large"]
                    }
                };
            }
            render() {
                return null;
            }
        }
        defineCustomElement('test-parent', Parent);
        class Child extends CustomElement {
            render() {
                return html `<slot></slot>`;
            }
        }
        defineCustomElement('test-child', Child);
        class GrandChild extends CustomElement {
            static get properties() {
                return {
                    size: {
                        type: DataTypes.String,
                        value: "medium",
                        options: ["small", "medium", "large"],
                        inherit: true
                    }
                };
            }
            render() {
                return null;
            }
        }
        defineCustomElement('test-grand-child', GrandChild);
        document.body.innerHTML = `<test-parent size="large">
            <test-child>
                <test-grand-child></test-grand-child>
            </test-child>
        </test-parent>`;
        const parent = document.querySelector('test-parent');
        await parent.updateComplete;
        const grandChild = document.querySelector('test-grand-child');
        expect(parent.adoptedChildren.size).toEqual(1);
        expect(parent.size).toBe('large');
        expect(grandChild.size).toBe('large');
    });
    it('should not set the property of the grand child if the parent with the inheritable property is not found', async () => {
        class Parent extends CustomElement {
            static get properties() {
                return {
                    size: {
                        type: DataTypes.String,
                        options: ["small", "medium", "large"]
                    }
                };
            }
            render() {
                return null;
            }
        }
        defineCustomElement('test-parent', Parent);
        class Child extends CustomElement {
            render() {
                return html `
                    <span>My size is ${this.size}</span>
                `;
            }
        }
        defineCustomElement('test-child', Child);
        class GrandChild extends CustomElement {
            static get properties() {
                return {
                    size: {
                        type: DataTypes.String,
                        options: ["small", "medium", "large"],
                        inherit: true
                    }
                };
            }
            render() {
                return null;
            }
        }
        defineCustomElement('test-grand-child', GrandChild);
        document.body.innerHTML = `<test-parent>
            <test-child>
                <test-grand-child></test-grand-child>
            </test-child>
        </test-parent>`;
        const parent = document.querySelector('test-parent');
        await parent.updateComplete;
        const grandChild = document.querySelector('test-grand-child');
        expect(parent.adoptedChildren.size).toEqual(1);
        expect(parent.size).toBe(undefined);
        expect(grandChild.size).toBe(undefined);
    });
    it('should not set the inherited property if the property of the child has been explicitly set', async () => {
        class Parent extends CustomElement {
            static get properties() {
                return {
                    size: {
                        type: DataTypes.String,
                        value: "medium",
                        options: ["small", "medium", "large"]
                    }
                };
            }
            render() {
                return html `
                    <span>Hello!</span>
                `;
            }
        }
        defineCustomElement('test-parent', Parent);
        class Child extends CustomElement {
            static get properties() {
                return {
                    size: {
                        type: DataTypes.String,
                        value: "medium",
                        options: ["small", "medium", "large"],
                        inherit: true
                    }
                };
            }
            render() {
                return html `
                    <span>My size is ${this.size}</span>
                `;
            }
        }
        defineCustomElement('test-child', Child);
        document.body.innerHTML = `<test-parent size="large">
            <test-child size="small"></test-child>
        </test-parent>`;
        const parent = document.querySelector('test-parent');
        await parent.updateComplete;
        const child = document.querySelector('test-child');
        expect(parent.adoptedChildren.size).toEqual(1);
        expect(Array.from(parent.adoptedChildren)[0]).toBe(child);
        expect(parent.size).toBe('large');
        expect(child.size).toBe('small');
    });
    it('should allow adding, replacing and removing children as parent attributes', async () => {
        class Parent extends CustomElement {
            static get properties() {
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
            render() {
                return html `<div>
                    <span>Hello, my name is ${this.name}</span>
                    ${this.renderChildren()}
                </div>`;
            }
            renderChildren() {
                return Array.from(this.kids).map(child => html `<test-child name=${child.name} age=${child.age}></test-child>`);
            }
        }
        defineCustomElement('test-parent', Parent);
        class Child extends CustomElement {
            static get properties() {
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
            render() {
                return html `<div class="child">
                    <span>My name is: {this.name}</span>
                    <span>My age is: {this.age}</span>
                </div>`;
            }
        }
        defineCustomElement('test-child', Child);
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
        const parent = document.querySelector('test-parent');
        await parent.updateComplete;
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
        await parent.updateComplete;
        expect(parent.shadowRoot?.innerHTML).toEqual("<div>\n                    <span>Hello, my name is <!--_$bm_-->Jorge<!--_$em_--></span><!--_$bm_--><test-child name=\"Mark\" age=\"30\"></test-child><test-child name=\"Sarah\" age=\"20\"></test-child><!--_$em_--></div>");
        parent.kids = [];
        await parent.updateComplete;
        expect(parent.shadowRoot?.innerHTML).toEqual("<div>\n                    <span>Hello, my name is <!--_$bm_-->Jorge<!--_$em_--></span><!--_$bm_--><!--_$em_--></div>");
    });
    it('should allow adding, replacing and removing slotted elements', async () => {
        const callTester = {
            didAdoptChildrenCallback(parent, children) {
                console.log(`${parent.constructor.name} -> ${children.size}`);
            }
        };
        class Parent extends CustomElement {
            static get properties() {
                return {
                    name: {
                        type: DataTypes.String,
                        required: true
                    }
                };
            }
            render() {
                return html `<div>
                    <span>Hello, my name is ${this.name}</span>
                    <slot></slot>
                </div>`;
            }
            didAdoptChildrenCallback(parent, children) {
                callTester.didAdoptChildrenCallback(parent, children);
            }
        }
        const spyDidAdoptChildrenCallback = jest.spyOn(callTester, 'didAdoptChildrenCallback');
        defineCustomElement('test-parent', Parent);
        class Child extends CustomElement {
            static get properties() {
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
            render() {
                return html `<div class="child">
                    <span>My name is: {this.name}</span>
                    <span>My age is: {this.age}</span>
                </div>`;
            }
        }
        defineCustomElement('test-child', Child);
        document.body.innerHTML = `<test-parent name="Jorge">
            <test-child name="Sarah" age="20"></test-child>
            <test-child name="Mark" age="30"></test-child>
        </test-parent>`;
        const parent = document.querySelector('test-parent');
        await parent.updateComplete;
        expect(parent.shadowRoot?.innerHTML).toEqual("<div>\n                    <span>Hello, my name is <!--_$bm_-->Jorge<!--_$em_--></span>\n                    <slot></slot>\n                </div>");
        expect(spyDidAdoptChildrenCallback).toBeCalledTimes(1);
    });
    it('should allow adding, replacing and removing children as slotted elements', async () => {
        class Parent extends CustomElement {
            static get properties() {
                return {
                    name: {
                        type: DataTypes.String,
                        required: true
                    }
                };
            }
            render() {
                return html `<div>
                    <span>Hello, my name is ${this.name}</span>
                    <slot></slot>
                </div>`;
            }
        }
        defineCustomElement('test-parent', Parent);
        class Child extends CustomElement {
            static get properties() {
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
            render() {
                return html `<div class="child">
                    <span>My name is: {this.name}</span>
                    <span>My age is: {this.age}</span>
                </div>`;
            }
        }
        defineCustomElement('test-child', Child);
        class Container extends CustomElement {
            static get properties() {
                return {
                    child: {
                        type: [
                            DataTypes.Object,
                            DataTypes.Function
                        ]
                    }
                };
            }
            render() {
                return html `<div class="container">
                    ${this.child}
                </div>`;
            }
        }
        defineCustomElement('test-container', Container);
        document.body.innerHTML = `<test-container></test-container>`;
        const container = document.querySelector('test-container');
        await container.updateComplete;
        expect(container.shadowRoot?.innerHTML).toEqual("<div class=\"container\"><!--_$bm_--><!--_$em_--></div>");
        container.child = html `<test-parent name="Jorge">
            <test-child name="Sarah" age="20"></test-child>
            <test-child name="Mark" age="30"></test-child>
        </test-parent>`;
        await container.updateComplete;
        expect(container.shadowRoot?.innerHTML).toEqual("<div class=\"container\"><!--_$bm_--><test-parent name=\"Jorge\">\n            <test-child name=\"Sarah\" age=\"20\"></test-child>\n            <test-child name=\"Mark\" age=\"30\"></test-child>\n        </test-parent><!--_$em_--></div>");
        container.child = null;
        await container.updateComplete;
        expect(container.shadowRoot?.innerHTML).toEqual("<div class=\"container\"><!--_$bm_--><!--_$em_--></div>");
    });
});
//# sourceMappingURL=CustomElement_ParentChild.spec.js.map