import { NodePatchingDataValues } from "../../../rendering/nodes/NodePatchingData";
import createNodePatcherRules from "../../../rendering/rules/createNodePatcherRules";
import createTemplate from "../../../rendering/template/createTemplate";
import { beginMarker, endMarker } from "../../../rendering/template/markers";

const extractTemplateStringArrays = (strings: TemplateStringsArray, ...values: NodePatchingDataValues): TemplateStringsArray => {

    console.log(values);

    return strings;
}

describe("create template tests", () => {

    it('should create a simple text node template', () => {

        const name = "Sarah";

        const strings = extractTemplateStringArrays`${name}`;

        const {
            templateString,
            template,
            keyIndex
        } = createTemplate(strings);

        expect(templateString).toEqual("<!--_$bm_--><!--_$em_-->");

        const {
            childNodes
        } = template.content;

        expect(childNodes.length).toEqual(2);

        let node = childNodes[0];

        expect(node.nodeType).toEqual(Node.COMMENT_NODE);

        expect((node as Comment).data).toEqual(beginMarker);

        node = childNodes[1];

        expect(node.nodeType).toEqual(Node.COMMENT_NODE);

        expect((node as Comment).data).toEqual(endMarker);

        expect(keyIndex).toEqual(undefined);
    });

    it('should create a literal template', () => {

        const strings = extractTemplateStringArrays`<input type="text" name="name"/>`;

        const {
            templateString,
            template,
            keyIndex
        } = createTemplate(strings);

        expect(templateString).toEqual('<input type="text" name="name"/>');

        const {
            childNodes
        } = template.content;

        expect(childNodes.length).toEqual(1); // INPUT

        expect(keyIndex).toEqual(undefined);
    });

    it('should create a template with an event', () => {

        const handleClick = () => {

            console.log('clicked')
        };

        const strings = extractTemplateStringArrays`<input type="text" name="name" onClick=${handleClick}/>`;

        const {
            templateString,
            template,
            keyIndex
        } = createTemplate(strings);

        expect(templateString).toEqual("<input type=\"text\" name=\"name\" onClick=\"_$evt:onClick\"/>");

        const {
            childNodes
        } = template.content;

        expect(childNodes.length).toEqual(1); // INPUT

        expect(keyIndex).toEqual(undefined);

        const rules = createNodePatcherRules(template.content);

        expect(rules.length).toEqual(1);
    });

    it('should create a template with an key', () => {

        const key = 26;

        const strings = extractTemplateStringArrays`<span key=${key}>Sarah</span>`;

        const {
            templateString,
            template,
            keyIndex
        } = createTemplate(strings);

        expect(templateString).toEqual("<span key=\"_$attr:key\">Sarah</span>");

        const {
            childNodes
        } = template.content;

        expect(childNodes.length).toEqual(1); // SPAN

        expect(keyIndex).toEqual(0);

        const rules = createNodePatcherRules(template.content);

        expect(rules.length).toEqual(1);
    });

    it('should create a two side by side text nodes template', () => {

        const name = "Sarah";

        const age = 19;

        const strings = extractTemplateStringArrays`${name}${age}`;

        const {
            templateString,
            template,
            keyIndex
        } = createTemplate(strings);

        expect(templateString).toEqual("<!--_$bm_--><!--_$em_--><!--_$bm_--><!--_$em_-->");

        const {
            childNodes
        } = template.content;

        expect(childNodes.length).toEqual(4);

        let node = childNodes[0];

        expect(node.nodeType).toEqual(Node.COMMENT_NODE);

        expect((node as Comment).data).toEqual(beginMarker);

        node = childNodes[1];

        expect(node.nodeType).toEqual(Node.COMMENT_NODE);

        expect((node as Comment).data).toEqual(endMarker);

        expect(keyIndex).toEqual(undefined);
    });

    it('should create a text node template', () => {

        const name = "Sarah";

        const strings = extractTemplateStringArrays`Name: ${name}`;

        const {
            templateString,
            template,
            keyIndex
        } = createTemplate(strings);

        expect(templateString).toEqual("Name: <!--_$bm_--><!--_$em_-->");

        const {
            childNodes
        } = template.content;

        expect(childNodes.length).toEqual(3);

        let node = childNodes[1];

        expect(node.nodeType).toEqual(Node.COMMENT_NODE);

        expect((node as Comment).data).toEqual(beginMarker);

        node = childNodes[2];

        expect(node.nodeType).toEqual(Node.COMMENT_NODE);

        expect((node as Comment).data).toEqual(endMarker);

        expect(keyIndex).toEqual(undefined);
    });

    it('should create an element template', () => {

        const name = "Sarah";

        const strings = extractTemplateStringArrays`
            <x-item class="item">
                My name is: ${name}
            </x-item>
        `;

        const {
            templateString,
            template,
            keyIndex
        } = createTemplate(strings);

        expect(templateString).toEqual("<x-item class=\"item\">\n                My name is: <!--_$bm_--><!--_$em_--></x-item>");

        const {
            childNodes
        } = template.content;

        expect(childNodes.length).toEqual(1);

        const node = childNodes[0];

        expect(node.nodeType).toEqual(Node.ELEMENT_NODE);

        expect((node as HTMLElement).tagName).toEqual('X-ITEM');

        expect(keyIndex).toEqual(undefined);
    });

    it('should create a self-closing element template with one attribute', () => {

        const href = "some-ref";

        const strings = extractTemplateStringArrays`<use href=${href} />`;

        const {
            templateString,
            template,
            keyIndex
        } = createTemplate(strings);

        expect(templateString).toEqual("<use href=\"_$attr:href\" />");

        const {
            childNodes
        } = template.content;

        expect(childNodes.length).toEqual(1);

        const node = childNodes[0];

        expect(node.nodeType).toEqual(Node.ELEMENT_NODE);

        expect((node as HTMLElement).tagName).toEqual('USE');

        expect(keyIndex).toEqual(undefined);
    });

    it('should create an element template with one attribute and a child text node', () => {

        const name = "Sarah";

        const age = 19;

        const strings = extractTemplateStringArrays`
            <x-item class="item" age=${age}>
                My name is: ${name}
            </x-item>
        `;

        const {
            templateString,
            template,
            keyIndex
        } = createTemplate(strings);

        expect(templateString).toEqual("<x-item class=\"item\" age=\"_$attr:age\">\n                My name is: <!--_$bm_--><!--_$em_--></x-item>");

        const {
            childNodes
        } = template.content;

        expect(childNodes.length).toEqual(1);

        const node = childNodes[0];

        expect(node.nodeType).toEqual(Node.ELEMENT_NODE);

        expect((node as HTMLElement).tagName).toEqual('X-ITEM');

        expect(keyIndex).toEqual(undefined);
    });

    it('should create an element template with two attributes', () => {

        const name = "Sarah";

        const age = 19;

        const description = "Smart and beautiful";

        const strings = extractTemplateStringArrays`
            <x-item class="item" age=${age} description=${description}>
                My name is: ${name}
            </x-item>
        `;

        const {
            templateString,
            template,
            keyIndex
        } = createTemplate(strings);

        expect(templateString).toEqual("<x-item class=\"item\" age=\"_$attr:age\" description=\"_$attr:description\">\n                My name is: <!--_$bm_--><!--_$em_--></x-item>");

        const {
            childNodes
        } = template.content;

        expect(childNodes.length).toEqual(1);

        const node = childNodes[0];

        expect(node.nodeType).toEqual(Node.ELEMENT_NODE);

        expect((node as HTMLElement).tagName).toEqual('X-ITEM');

        expect(keyIndex).toEqual(undefined);
    });

    it('should create a self-closing element template with two attributes', () => {

        const name = "Sarah";

        const description = "Smart and beautiful";

        const strings = extractTemplateStringArrays`
            <x-item class="item" name=${name} description=${description} />
        `;

        const {
            templateString,
            template,
            keyIndex
        } = createTemplate(strings);

        expect(templateString).toEqual("<x-item class=\"item\" name=\"_$attr:name\" description=\"_$attr:description\" />");

        const {
            childNodes
        } = template.content;

        expect(childNodes.length).toEqual(1);

        const node = childNodes[0];

        expect(node.nodeType).toEqual(Node.ELEMENT_NODE);

        expect((node as HTMLElement).tagName).toEqual('X-ITEM');

        expect(keyIndex).toEqual(undefined);
    });

    it('should create a template with null values', () => {

        const strings = extractTemplateStringArrays`
            ${null}     
            <span style="display:inline-block; width: 1rem;">
                ${null}
            </span>
        `;

        const {
            templateString,
            template,
            keyIndex
        } = createTemplate(strings);

        expect(templateString).toEqual("<!--_$bm_--><!--_$em_--><span style=\"display:inline-block; width: 1rem;\"><!--_$bm_--><!--_$em_--></span>");

        const {
            childNodes
        } = template.content;

        expect(childNodes.length).toEqual(3);

        expect(keyIndex).toEqual(undefined);

        const rules = createNodePatcherRules(template.content);

        expect(rules.length).toEqual(2);
    });

    it('should create a template with attribute values after node values', () => {

        const strings = extractTemplateStringArrays`
        <div>
            ${null}     
            <span>
                ${null}
            </span>    
        </div>
        <div items=${[]}></div>`; // Transitioning to attributes

        const {
            templateString,
            template,
            keyIndex
        } = createTemplate(strings);

        expect(templateString).toEqual("<div><!--_$bm_--><!--_$em_--><span><!--_$bm_--><!--_$em_--></span>    \n        </div>\n        <div items=\"_$attr:items\"></div>");

        const {
            childNodes
        } = template.content;

        expect(childNodes.length).toEqual(3);

        expect(keyIndex).toEqual(undefined);

        const rules = createNodePatcherRules(template.content);

        expect(rules.length).toEqual(3);
    });

    it('should create a template with attribute values mixed with node values', () => {

        const strings = extractTemplateStringArrays`
        <div>
            ${null}     
            <span>
                ${null}
            </span>    
        </div>
        <div items=${[]}></div>
        <span>
            ${null}
        </span>
        <div name=${'Sarah'}></div>`;

        const {
            templateString,
            template,
            keyIndex
        } = createTemplate(strings);

        expect(templateString).toEqual("<div><!--_$bm_--><!--_$em_--><span><!--_$bm_--><!--_$em_--></span>    \n        </div>\n        <div items=\"_$attr:items\"></div>\n        <span><!--_$bm_--><!--_$em_--></span>\n        <div name=\"_$attr:name\"></div>");

        const {
            childNodes
        } = template.content;

        expect(childNodes.length).toEqual(7);

        expect(keyIndex).toEqual(undefined);

        const rules = createNodePatcherRules(template.content);

        expect(rules.length).toEqual(5);
    });

    it('should create a template with several nodes (1)', () => {

        const header = "Header";

        const name = "Sarah";

        const footer = "Header";

        const strings = extractTemplateStringArrays`
            ${header}
            <x-item class="item">
                My name is: ${name}
            </x-item>
            ${footer}
        `;

        const {
            templateString,
            template,
            keyIndex
        } = createTemplate(strings);

        expect(templateString).toEqual("<!--_$bm_--><!--_$em_--><x-item class=\"item\">\n                My name is: <!--_$bm_--><!--_$em_--></x-item><!--_$bm_--><!--_$em_-->");

        const {
            childNodes
        } = template.content;

        expect(childNodes.length).toEqual(5);

        expect(keyIndex).toEqual(undefined);
    });

    it('should create a template with several nodes (2)', () => {

        const header = "Header";

        const name = "Sarah";

        const footer = "Header";

        const strings = extractTemplateStringArrays`
            Header: ${header}
            <x-item class="item">
                My name is: ${name}
            </x-item>
            Footer: ${footer}
        `;

        const {
            templateString,
            template,
            keyIndex
        } = createTemplate(strings);

        expect(templateString).toEqual("\n            Header: <!--_$bm_--><!--_$em_--><x-item class=\"item\">\n                My name is: <!--_$bm_--><!--_$em_--></x-item>\n            Footer: <!--_$bm_--><!--_$em_-->");

        const {
            childNodes
        } = template.content;

        expect(childNodes.length).toEqual(7);

        expect(keyIndex).toEqual(undefined);
    });

    it('should create a template with several nodes: x-item is self-closing', () => {

        const header = "Header";

        const footer = "Header";

        const strings = extractTemplateStringArrays`
            Header: ${header}
            <x-item class="item"></x-item>
            Footer: ${footer}
        `;

        const {
            templateString,
            template,
            keyIndex
        } = createTemplate(strings);

        expect(templateString).toEqual("\n            Header: <!--_$bm_--><!--_$em_--><x-item class=\"item\"></x-item>\n            Footer: <!--_$bm_--><!--_$em_-->");

        const {
            childNodes
        } = template.content;

        expect(childNodes.length).toEqual(7);

        expect(keyIndex).toEqual(undefined);
    });
});