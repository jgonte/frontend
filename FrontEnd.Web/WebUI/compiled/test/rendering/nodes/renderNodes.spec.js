import html from "../../../rendering/html";
import { mountNode, mountNodes } from "../../../rendering/nodes/mountNodes";
import { updateNode, updateNodes } from "../../../rendering/nodes/updateNodes";
import { NodePatcherRuleTypes } from "../../../rendering/rules/NodePatcherRule";
describe("render nodes tests", () => {
    it('should render a text node', () => {
        let name = "Sarah";
        let patchingData = html `${name}`;
        const { patcher, values } = patchingData;
        expect(patchingData.rules).toBeNull();
        expect(values).toEqual([name]);
        const { content } = patcher.template;
        expect(content).toBeInstanceOf(DocumentFragment);
        const container = document.createElement('span');
        mountNode(container, patchingData);
        expect(container.outerHTML).toEqual("<span><!--_$bm_-->Sarah<!--_$em_--></span>");
        name = "Sarah";
        let oldPatchingData = patchingData;
        patchingData = html `${name}`;
        updateNode(container, oldPatchingData, patchingData);
        expect(container.outerHTML).toEqual("<span><!--_$bm_-->Sarah<!--_$em_--></span>");
        name = "Mark";
        oldPatchingData = patchingData;
        patchingData = html `${name}`;
        updateNode(container, oldPatchingData, patchingData);
        expect(container.outerHTML).toEqual("<span><!--_$bm_-->Mark<!--_$em_--></span>");
        name = null;
        oldPatchingData = patchingData;
        patchingData = html `${name}`;
        updateNode(container, oldPatchingData, patchingData);
        expect(container.outerHTML).toEqual("<span><!--_$bm_--><!--_$em_--></span>");
        name = "Sarah";
        oldPatchingData = patchingData;
        patchingData = html `${name}`;
        updateNode(container, oldPatchingData, patchingData);
        expect(container.outerHTML).toEqual("<span><!--_$bm_-->Sarah<!--_$em_--></span>");
    });
    it('should render an array of text nodes', () => {
        let name = [
            "Sarah",
            " is beautiful"
        ];
        let patchingData = html `${name}`;
        const { patcher, values } = patchingData;
        expect(patchingData.rules).toBeNull();
        expect(values).toEqual([name]);
        const { content } = patcher.template;
        expect(content).toBeInstanceOf(DocumentFragment);
        const container = document.createElement('span');
        mountNode(container, patchingData);
        expect(container.outerHTML).toEqual("<span><!--_$bm_-->Sarah is beautiful<!--_$em_--></span>");
        name = [
            "Sarah",
            " is beautiful"
        ];
        let oldPatchingData = patchingData;
        patchingData = html `${name}`;
        updateNode(container, oldPatchingData, patchingData);
        expect(container.outerHTML).toEqual("<span><!--_$bm_-->Sarah is beautiful<!--_$em_--></span>");
        name = [
            "Mark",
            " is hard worker"
        ];
        oldPatchingData = patchingData;
        patchingData = html `${name}`;
        updateNode(container, oldPatchingData, patchingData);
        expect(container.outerHTML).toEqual("<span><!--_$bm_-->Mark is hard worker<!--_$em_--></span>");
        name = null;
        oldPatchingData = patchingData;
        patchingData = html `${name}`;
        updateNode(container, oldPatchingData, patchingData);
        expect(container.outerHTML).toEqual("<span><!--_$bm_--><!--_$em_--></span>");
        name = [
            "Sarah",
            " is beautiful"
        ];
        oldPatchingData = patchingData;
        patchingData = html `${name}`;
        updateNode(container, oldPatchingData, patchingData);
        expect(container.outerHTML).toEqual("<span><!--_$bm_-->Sarah is beautiful<!--_$em_--></span>");
    });
    it('should render component with 3 level rendering', () => {
        const renderItem = (record) => {
            return html `${record.description}`;
        };
        const renderItems = (data) => {
            return data.map(record => {
                return html `<li key=${record.id}>
                    <gcs-selector select-value=${record}>${renderItem(record)}</gcs-selector>
                </li>`;
            });
        };
        let data = [
            {
                id: 1,
                description: "Item 1"
            },
            {
                id: 2,
                description: "Item 2"
            }
        ];
        let patchingData = html `<ul>
            ${renderItems(data)}
        </ul>`;
        const { patcher } = patchingData;
        expect(patchingData.rules).toBeNull();
        const { content } = patcher.template;
        expect(content).toBeInstanceOf(DocumentFragment);
        const container = document.createElement('div');
        mountNode(container, patchingData);
        expect(container.outerHTML).toEqual("<div><ul><!--_$bm_--><li key=\"1\">\n                    <gcs-selector><!--_$bm_--><!--_$bm_-->Item 1<!--_$em_--><!--_$em_--></gcs-selector>\n                </li><li key=\"2\">\n                    <gcs-selector><!--_$bm_--><!--_$bm_-->Item 2<!--_$em_--><!--_$em_--></gcs-selector>\n                </li><!--_$em_--></ul></div>");
        const values = patchingData.values[0];
        const value1 = values[0];
        expect(value1?.node?.nodeName).toEqual('LI');
        const nestedValue1 = value1?.values[2];
        expect(nestedValue1?.node?.nodeName).toEqual('#comment');
        const value2 = values[1];
        expect(value2?.node?.nodeName).toEqual('LI');
        const nestedValue2 = value2.values[2];
        expect(nestedValue2?.node?.nodeName).toEqual('#comment');
        data = [
            {
                id: 2,
                description: "Item 2"
            }
        ];
        let oldPatchingData = patchingData;
        patchingData = html `<ul>
            ${renderItems(data)}
        </ul>`;
        updateNode(container, oldPatchingData, patchingData);
        expect(container.outerHTML).toEqual("<div><ul><!--_$bm_--><li key=\"2\">\n                    <gcs-selector><!--_$bm_--><!--_$bm_-->Item 2<!--_$em_--><!--_$em_--></gcs-selector>\n                </li><!--_$em_--></ul></div>");
        data = [
            {
                id: 1,
                description: "Item 1"
            },
            {
                id: 2,
                description: "Item 2"
            }
        ];
        oldPatchingData = patchingData;
        patchingData = html `<ul>
            ${renderItems(data)}
        </ul>`;
        updateNode(container, oldPatchingData, patchingData);
        expect(container.outerHTML).toEqual("<div><ul><!--_$bm_--><li key=\"1\">\n                    <gcs-selector><!--_$bm_--><!--_$bm_-->Item 1<!--_$em_--><!--_$em_--></gcs-selector>\n                </li><li key=\"2\">\n                    <gcs-selector><!--_$bm_--><!--_$bm_-->Item 2<!--_$em_--><!--_$em_--></gcs-selector>\n                </li><!--_$em_--></ul></div>");
        data = [];
        oldPatchingData = patchingData;
        patchingData = html `<ul>
            ${renderItems(data)}
        </ul>`;
        updateNode(container, oldPatchingData, patchingData);
        expect(container.outerHTML).toEqual("<div><ul><!--_$bm_--><!--_$em_--></ul></div>");
        data = [
            {
                id: 1,
                description: "Item 1"
            },
            {
                id: 2,
                description: "Item 2"
            }
        ];
        oldPatchingData = patchingData;
        patchingData = html `<ul>
            ${renderItems(data)}
        </ul>`;
        updateNode(container, oldPatchingData, patchingData);
        expect(container.outerHTML).toEqual("<div><ul><!--_$bm_--><li key=\"1\">\n                    <gcs-selector><!--_$bm_--><!--_$bm_-->Item 1<!--_$em_--><!--_$em_--></gcs-selector>\n                </li><li key=\"2\">\n                    <gcs-selector><!--_$bm_--><!--_$bm_-->Item 2<!--_$em_--><!--_$em_--></gcs-selector>\n                </li><!--_$em_--></ul></div>");
        data = [
            {
                id: 3,
                description: "Item 3"
            },
            {
                id: 1,
                description: "Item 1"
            },
            {
                id: 2,
                description: "Item 2"
            }
        ];
        oldPatchingData = patchingData;
        patchingData = html `<ul>
            ${renderItems(data)}
        </ul>`;
        updateNode(container, oldPatchingData, patchingData);
        expect(container.outerHTML).toEqual("<div><ul><!--_$bm_--><li key=\"3\">\n                    <gcs-selector><!--_$bm_--><!--_$bm_-->Item 3<!--_$em_--><!--_$em_--></gcs-selector>\n                </li><li key=\"1\">\n                    <gcs-selector><!--_$bm_--><!--_$bm_-->Item 1<!--_$em_--><!--_$em_--></gcs-selector>\n                </li><li key=\"2\">\n                    <gcs-selector><!--_$bm_--><!--_$bm_-->Item 2<!--_$em_--><!--_$em_--></gcs-selector>\n                </li><!--_$em_--></ul></div>");
        data = [
            {
                id: 3,
                description: "Item 3"
            },
            {
                id: 1,
                description: "Item 1"
            },
            {
                id: 4,
                description: "Item 4"
            },
            {
                id: 2,
                description: "Item 2"
            }
        ];
        oldPatchingData = patchingData;
        patchingData = html `<ul>
            ${renderItems(data)}
        </ul>`;
        updateNode(container, oldPatchingData, patchingData);
        expect(container.outerHTML).toEqual("<div><ul><!--_$bm_--><li key=\"3\">\n                    <gcs-selector><!--_$bm_--><!--_$bm_-->Item 3<!--_$em_--><!--_$em_--></gcs-selector>\n                </li><li key=\"1\">\n                    <gcs-selector><!--_$bm_--><!--_$bm_-->Item 1<!--_$em_--><!--_$em_--></gcs-selector>\n                </li><li key=\"4\">\n                    <gcs-selector><!--_$bm_--><!--_$bm_-->Item 4<!--_$em_--><!--_$em_--></gcs-selector>\n                </li><li key=\"2\">\n                    <gcs-selector><!--_$bm_--><!--_$bm_-->Item 2<!--_$em_--><!--_$em_--></gcs-selector>\n                </li><!--_$em_--></ul></div>");
    });
    it('should render an array of elements', () => {
        const renderItem = (record) => {
            return html `${record.description}`;
        };
        const renderItems = (data) => {
            return data.map(record => {
                return html `<span key=${record.id}>
                    <gcs-selector select-value=${record}>${renderItem(record)}</gcs-selector>
                </span>`;
            });
        };
        let data = [
            {
                id: 1,
                description: "Item 1"
            },
            {
                id: 2,
                description: "Item 2"
            }
        ];
        let patchingData = renderItems(data);
        expect(patchingData.length).toEqual(2);
        const container = document.createElement('div');
        mountNodes(container, patchingData);
        expect(container.outerHTML).toEqual("<div><span key=\"1\">\n                    <gcs-selector><!--_$bm_--><!--_$bm_-->Item 1<!--_$em_--><!--_$em_--></gcs-selector>\n                </span><span key=\"2\">\n                    <gcs-selector><!--_$bm_--><!--_$bm_-->Item 2<!--_$em_--><!--_$em_--></gcs-selector>\n                </span></div>");
        let value1 = patchingData[0];
        expect(value1.node?.nodeName).toEqual('SPAN');
        let nestedValue1 = value1.values[2];
        expect(nestedValue1?.node?.nodeName).toEqual('#comment');
        const value2 = patchingData[1];
        expect(value2.node?.nodeName).toEqual('SPAN');
        const nestedValue2 = value2.values[2];
        expect(nestedValue2?.node?.nodeName).toEqual('#comment');
        data = [
            {
                id: 2,
                description: "Item 2"
            }
        ];
        let oldPatchingData = patchingData;
        patchingData = renderItems(data);
        updateNodes(container, oldPatchingData, patchingData);
        expect(container.outerHTML).toEqual("<div><span key=\"2\">\n                    <gcs-selector><!--_$bm_--><!--_$bm_-->Item 2<!--_$em_--><!--_$em_--></gcs-selector>\n                </span></div>");
        value1 = patchingData[0];
        expect(value1.node?.nodeName).toEqual('SPAN');
        nestedValue1 = value1.values[2];
        expect(nestedValue1?.node?.nodeName).toEqual('#comment');
        data = [
            {
                id: 1,
                description: "Item 1"
            },
            {
                id: 2,
                description: "Item 2"
            }
        ];
        oldPatchingData = patchingData;
        patchingData = renderItems(data);
        updateNodes(container, oldPatchingData, patchingData);
        expect(container.outerHTML).toEqual("<div><span key=\"1\">\n                    <gcs-selector><!--_$bm_--><!--_$bm_-->Item 1<!--_$em_--><!--_$em_--></gcs-selector>\n                </span><span key=\"2\">\n                    <gcs-selector><!--_$bm_--><!--_$bm_-->Item 2<!--_$em_--><!--_$em_--></gcs-selector>\n                </span></div>");
        data = [];
        oldPatchingData = patchingData;
        patchingData = renderItems(data);
        updateNodes(container, oldPatchingData, patchingData);
        expect(container.outerHTML).toEqual("<div></div>");
        data = [
            {
                id: 1,
                description: "Item 1"
            },
            {
                id: 2,
                description: "Item 2"
            }
        ];
        oldPatchingData = patchingData;
        patchingData = renderItems(data);
        updateNodes(container, oldPatchingData, patchingData);
        expect(container.outerHTML).toEqual("<div><span key=\"1\">\n                    <gcs-selector><!--_$bm_--><!--_$bm_-->Item 1<!--_$em_--><!--_$em_--></gcs-selector>\n                </span><span key=\"2\">\n                    <gcs-selector><!--_$bm_--><!--_$bm_-->Item 2<!--_$em_--><!--_$em_--></gcs-selector>\n                </span></div>");
        data = [
            {
                id: 2,
                description: "Item 2"
            },
            {
                id: 1,
                description: "Item 1"
            }
        ];
        oldPatchingData = patchingData;
        patchingData = renderItems(data);
        updateNodes(container, oldPatchingData, patchingData);
        expect(container.outerHTML).toEqual("<div><span key=\"2\">\n                    <gcs-selector><!--_$bm_--><!--_$bm_-->Item 2<!--_$em_--><!--_$em_--></gcs-selector>\n                </span><span key=\"1\">\n                    <gcs-selector><!--_$bm_--><!--_$bm_-->Item 1<!--_$em_--><!--_$em_--></gcs-selector>\n                </span></div>");
    });
    it('should render a collection of non-keyed nodes', () => {
        let data = [
            {
                name: 'Sarah',
                age: 19
            },
            {
                name: 'Mark',
                age: 31
            }
        ];
        let patchingData = data.map(r => html `<span age=${r.age}>${r.name}</span>`);
        const container = document.createElement('div');
        mountNodes(container, patchingData);
        expect(container.outerHTML).toEqual('<div><span age=\"19\"><!--_$bm_-->Sarah<!--_$em_--></span><span age=\"31\"><!--_$bm_-->Mark<!--_$em_--></span></div>');
        data = [
            {
                name: 'Mark',
                age: 31
            },
            {
                name: 'Sarah',
                age: 19
            }
        ];
        let oldPatchingData = patchingData;
        patchingData = data.map(r => html `<span age=${r.age}>${r.name}</span>`);
        updateNodes(container, oldPatchingData, patchingData);
        expect(container.outerHTML).toEqual("<div><span age=\"31\"><!--_$bm_-->Mark<!--_$em_--></span><span age=\"19\"><!--_$bm_-->Sarah<!--_$em_--></span></div>");
        data = [];
        oldPatchingData = patchingData;
        patchingData = data.map(r => html `<span age=${r.age}>${r.name}</span>`);
        updateNodes(container, oldPatchingData, patchingData);
        expect(container.outerHTML).toEqual("<div></div>");
        data = [
            {
                name: 'Sarah',
                age: 19
            },
            {
                name: 'Mark',
                age: 31
            }
        ];
        oldPatchingData = patchingData;
        patchingData = data.map(r => html `<span age=${r.age}>${r.name}</span>`);
        updateNodes(container, oldPatchingData, patchingData);
        expect(container.outerHTML).toEqual("<div><span age=\"19\"><!--_$bm_-->Sarah<!--_$em_--></span><span age=\"31\"><!--_$bm_-->Mark<!--_$em_--></span></div>");
        data = [
            {
                name: 'Mark',
                age: 31
            },
            {
                name: 'Sarah',
                age: 19
            }
        ];
        oldPatchingData = patchingData;
        patchingData = data.map(r => html `<span age=${r.age}>${r.name}</span>`);
        updateNodes(container, oldPatchingData, patchingData);
        expect(container.outerHTML).toEqual("<div><span age=\"31\"><!--_$bm_-->Mark<!--_$em_--></span><span age=\"19\"><!--_$bm_-->Sarah<!--_$em_--></span></div>");
    });
    it('should replace the names of non keyed elements', () => {
        let data = [
            {
                name: 'Sarah',
                age: 19
            },
            {
                name: 'Mark',
                age: 31
            },
            {
                name: 'Sasha',
                age: 1
            }
        ];
        let patchingData = data.map(r => html `<span age=${r.age}>${r.name}</span>`);
        const container = document.createElement('div');
        mountNodes(container, patchingData);
        expect(container.outerHTML).toEqual('<div><span age=\"19\"><!--_$bm_-->Sarah<!--_$em_--></span><span age=\"31\"><!--_$bm_-->Mark<!--_$em_--></span><span age=\"1\"><!--_$bm_-->Sasha<!--_$em_--></span></div>');
        data = [
            {
                name: 'Dafni',
                age: 19
            },
            {
                name: 'Moshe',
                age: 31
            },
            {
                name: 'Victor',
                age: 1
            }
        ];
        const oldPatchingData = patchingData;
        patchingData = data.map(r => html `<span age=${r.age}>${r.name}</span>`);
        updateNodes(container, oldPatchingData, patchingData);
        expect(container.outerHTML).toEqual('<div><span age=\"19\"><!--_$bm_-->Dafni<!--_$em_--></span><span age=\"31\"><!--_$bm_-->Moshe<!--_$em_--></span><span age=\"1\"><!--_$bm_-->Victor<!--_$em_--></span></div>');
    });
    it('should replace the names of keyed elements', () => {
        let data = [
            {
                id: 1,
                name: 'Sarah',
                age: 19
            },
            {
                id: 2,
                name: 'Mark',
                age: 31
            },
            {
                id: 3,
                name: 'Sasha',
                age: 1
            }
        ];
        let patchingData = data.map(r => html `<span key=${r.id} age=${r.age}>${r.name}</span>`);
        const container = document.createElement('div');
        mountNodes(container, patchingData);
        expect(container.outerHTML).toEqual('<div><span key=\"1\" age=\"19\"><!--_$bm_-->Sarah<!--_$em_--></span><span key=\"2\" age=\"31\"><!--_$bm_-->Mark<!--_$em_--></span><span key=\"3\" age=\"1\"><!--_$bm_-->Sasha<!--_$em_--></span></div>');
        data = [
            {
                id: 1,
                name: 'Dafni',
                age: 19
            },
            {
                id: 2,
                name: 'Moshe',
                age: 31
            },
            {
                id: 3,
                name: 'Victor',
                age: 1
            }
        ];
        const oldPatchingData = patchingData;
        patchingData = data.map(r => html `<span key=${r.id} age=${r.age}>${r.name}</span>`);
        updateNodes(container, oldPatchingData, patchingData);
        expect(container.outerHTML).toEqual('<div><span key=\"1\" age=\"19\"><!--_$bm_-->Dafni<!--_$em_--></span><span key=\"2\" age=\"31\"><!--_$bm_-->Moshe<!--_$em_--></span><span key=\"3\" age=\"1\"><!--_$bm_-->Victor<!--_$em_--></span></div>');
    });
    it('should render a collection of keyed nodes', () => {
        let data = [
            {
                id: 1,
                name: 'Sarah',
                age: 19
            },
            {
                id: 2,
                name: 'Mark',
                age: 31
            }
        ];
        let patchingData = data.map(r => html `<span key=${r.id} age=${r.age}>${r.name}</span>`);
        const container = document.createElement('div');
        mountNodes(container, patchingData);
        expect(container.outerHTML).toEqual('<div><span key=\"1\" age=\"19\"><!--_$bm_-->Sarah<!--_$em_--></span><span key=\"2\" age=\"31\"><!--_$bm_-->Mark<!--_$em_--></span></div>');
        data = [
            {
                id: 2,
                name: 'Mark',
                age: 31
            },
            {
                id: 1,
                name: 'Sarah',
                age: 19
            }
        ];
        let oldPatchingData = patchingData;
        patchingData = data.map(r => html `<span key=${r.id} age=${r.age}>${r.name}</span>`);
        updateNodes(container, oldPatchingData, patchingData);
        expect(container.outerHTML).toEqual('<div><span key=\"2\" age=\"31\"><!--_$bm_-->Mark<!--_$em_--></span><span key=\"1\" age=\"19\"><!--_$bm_-->Sarah<!--_$em_--></span></div>');
        data = [];
        oldPatchingData = patchingData;
        patchingData = data.map(r => html `<span key=${r.id} age=${r.age}>${r.name}</span>`);
        updateNodes(container, oldPatchingData, patchingData);
        expect(container.outerHTML).toEqual('<div></div>');
        data = [
            {
                id: 1,
                name: 'Sarah',
                age: 19
            },
            {
                id: 2,
                name: 'Mark',
                age: 31
            }
        ];
        oldPatchingData = patchingData;
        patchingData = data.map(r => html `<span key=${r.id} age=${r.age}>${r.name}</span>`);
        updateNodes(container, oldPatchingData, patchingData);
        expect(container.outerHTML).toEqual('<div><span key=\"1\" age=\"19\"><!--_$bm_-->Sarah<!--_$em_--></span><span key=\"2\" age=\"31\"><!--_$bm_-->Mark<!--_$em_--></span></div>');
        data = [
            {
                id: 1,
                name: 'Sarah',
                age: 19
            },
            {
                id: 2,
                name: 'Mark',
                age: 31
            },
            {
                id: 3,
                name: 'Jorge',
                age: 55
            }
        ];
        oldPatchingData = patchingData;
        patchingData = data.map(r => html `<span key=${r.id} age=${r.age}>${r.name}</span>`);
        updateNodes(container, oldPatchingData, patchingData);
        expect(container.outerHTML).toEqual("<div><span key=\"1\" age=\"19\"><!--_$bm_-->Sarah<!--_$em_--></span><span key=\"2\" age=\"31\"><!--_$bm_-->Mark<!--_$em_--></span><span key=\"3\" age=\"55\"><!--_$bm_-->Jorge<!--_$em_--></span></div>");
    });
    it('should render a collection of keyed nodes swap two first elements', () => {
        let data = [
            {
                id: 1,
                name: 'Sarah',
                age: 19
            },
            {
                id: 2,
                name: 'Mark',
                age: 31
            },
            {
                id: 3,
                name: 'Sasha',
                age: 1
            }
        ];
        let patchingData = data.map(r => html `<span key=${r.id} age=${r.age}>${r.name}</span>`);
        const container = document.createElement('div');
        mountNodes(container, patchingData);
        expect(container.outerHTML).toEqual('<div><span key=\"1\" age=\"19\"><!--_$bm_-->Sarah<!--_$em_--></span><span key=\"2\" age=\"31\"><!--_$bm_-->Mark<!--_$em_--></span><span key=\"3\" age=\"1\"><!--_$bm_-->Sasha<!--_$em_--></span></div>');
        data = [
            {
                id: 2,
                name: 'Mark',
                age: 31
            },
            {
                id: 1,
                name: 'Sarah',
                age: 19
            },
            {
                id: 3,
                name: 'Sasha',
                age: 1
            }
        ];
        const oldPatchingData = patchingData;
        patchingData = data.map(r => html `<span key=${r.id} age=${r.age}>${r.name}</span>`);
        updateNodes(container, oldPatchingData, patchingData);
        expect(container.outerHTML).toEqual('<div><span key=\"2\" age=\"31\"><!--_$bm_-->Mark<!--_$em_--></span><span key=\"1\" age=\"19\"><!--_$bm_-->Sarah<!--_$em_--></span><span key=\"3\" age=\"1\"><!--_$bm_-->Sasha<!--_$em_--></span></div>');
    });
    it('should render a collection of keyed nodes swap first and last elements', () => {
        let data = [
            {
                id: 1,
                name: 'Sarah',
                age: 19
            },
            {
                id: 2,
                name: 'Mark',
                age: 31
            },
            {
                id: 3,
                name: 'Sasha',
                age: 1
            }
        ];
        let patchingData = data.map(r => html `<span key=${r.id} age=${r.age}>${r.name}</span>`);
        const container = document.createElement('div');
        mountNodes(container, patchingData);
        expect(container.outerHTML).toEqual('<div><span key=\"1\" age=\"19\"><!--_$bm_-->Sarah<!--_$em_--></span><span key=\"2\" age=\"31\"><!--_$bm_-->Mark<!--_$em_--></span><span key=\"3\" age=\"1\"><!--_$bm_-->Sasha<!--_$em_--></span></div>');
        data = [
            {
                id: 3,
                name: 'Sasha',
                age: 1
            },
            {
                id: 2,
                name: 'Mark',
                age: 31
            },
            {
                id: 1,
                name: 'Sarah',
                age: 19
            }
        ];
        const oldPatchingData = patchingData;
        patchingData = data.map(r => html `<span key=${r.id} age=${r.age}>${r.name}</span>`);
        updateNodes(container, oldPatchingData, patchingData);
        expect(container.outerHTML).toEqual('<div><span key=\"3\" age=\"1\"><!--_$bm_-->Sasha<!--_$em_--></span><span key=\"2\" age=\"31\"><!--_$bm_-->Mark<!--_$em_--></span><span key=\"1\" age=\"19\"><!--_$bm_-->Sarah<!--_$em_--></span></div>');
    });
    it('should render a collection of keyed nodes swap two last elements', () => {
        let data = [
            {
                id: 1,
                name: 'Sarah',
                age: 19
            },
            {
                id: 2,
                name: 'Mark',
                age: 31
            },
            {
                id: 3,
                name: 'Sasha',
                age: 1
            }
        ];
        let patchingData = data.map(r => html `<span key=${r.id} age=${r.age}>${r.name}</span>`);
        const container = document.createElement('div');
        mountNodes(container, patchingData);
        expect(container.outerHTML).toEqual('<div><span key=\"1\" age=\"19\"><!--_$bm_-->Sarah<!--_$em_--></span><span key=\"2\" age=\"31\"><!--_$bm_-->Mark<!--_$em_--></span><span key=\"3\" age=\"1\"><!--_$bm_-->Sasha<!--_$em_--></span></div>');
        data = [
            {
                id: 1,
                name: 'Sarah',
                age: 19
            },
            {
                id: 3,
                name: 'Sasha',
                age: 1
            },
            {
                id: 2,
                name: 'Mark',
                age: 31
            }
        ];
        const oldPatchingData = patchingData;
        patchingData = data.map(r => html `<span key=${r.id} age=${r.age}>${r.name}</span>`);
        updateNodes(container, oldPatchingData, patchingData);
        expect(container.outerHTML).toEqual('<div><span key=\"1\" age=\"19\"><!--_$bm_-->Sarah<!--_$em_--></span><span key=\"3\" age=\"1\"><!--_$bm_-->Sasha<!--_$em_--></span><span key=\"2\" age=\"31\"><!--_$bm_-->Mark<!--_$em_--></span></div>');
    });
    it('should not render a complex object as a stringified value', () => {
        let data = {
            name: "Sarah",
            age: 19,
            description: "Smart and beautiful"
        };
        let patchingData = html `<x-container class="container" record=${data}></x-container>`;
        const container = document.createElement('div');
        mountNode(container, patchingData);
        expect(container.outerHTML).toEqual("<div><x-container class=\"container\"></x-container></div>");
        expect(container.children[0].record).toEqual(data);
        data = {
            name: "Mark",
            age: 31,
            description: "Business man"
        };
        const oldPatchingData = patchingData;
        patchingData = html `<x-container class="container" record=${data}></x-container>`;
        updateNode(container, oldPatchingData, patchingData);
        expect(container.outerHTML).toEqual("<div><x-container class=\"container\"></x-container></div>");
        expect(container.children[0].record).toEqual(data);
    });
    it('should render a collection of children before a slot', () => {
        const container = document.createElement('div');
        let itemsPatchingData = null;
        let containerPatchingData = html `
            <x-container class="container">       
                ${itemsPatchingData}
            </x-container>
        `;
        mountNode(container, containerPatchingData);
        expect(container.outerHTML).toEqual("<div><x-container class=\"container\"><!--_$bm_--><!--_$em_--></x-container></div>");
        let names = ["Sarah", "Mark", "Sasha"];
        itemsPatchingData = html `
            ${names.map(name => html `<span>${name}</span>`)}
            <slot></slot>`;
        let oldPatchingData = containerPatchingData;
        containerPatchingData = html `
            <x-container class="container">       
                ${itemsPatchingData}
            </x-container>
        `;
        updateNode(container, oldPatchingData, containerPatchingData);
        expect(container.outerHTML).toEqual("<div><x-container class=\"container\"><!--_$bm_--><!--_$bm_--><span><!--_$bm_-->Sarah<!--_$em_--></span><span><!--_$bm_-->Mark<!--_$em_--></span><span><!--_$bm_-->Sasha<!--_$em_--></span><!--_$em_--><slot></slot><!--_$em_--></x-container></div>");
        names = ["Mark", "Sasha", "Sarah"];
        itemsPatchingData = html `
            ${names.map(name => html `<span>${name}</span>`)}
            <slot></slot>`;
        oldPatchingData = containerPatchingData;
        containerPatchingData = html `
            <x-container class="container">       
                ${itemsPatchingData}
            </x-container>
        `;
        updateNode(container, oldPatchingData, containerPatchingData);
        expect(container.outerHTML).toEqual("<div><x-container class=\"container\"><!--_$bm_--><!--_$bm_--><span><!--_$bm_-->Mark<!--_$em_--></span><span><!--_$bm_-->Sasha<!--_$em_--></span><span><!--_$bm_-->Sarah<!--_$em_--></span><!--_$em_--><slot></slot><!--_$em_--></x-container></div>");
        itemsPatchingData = null;
        oldPatchingData = containerPatchingData;
        containerPatchingData = html `
            <x-container class="container">       
                ${itemsPatchingData}
            </x-container>
        `;
        updateNode(container, oldPatchingData, containerPatchingData);
        expect(container.outerHTML).toEqual("<div><x-container class=\"container\"><!--_$bm_--><!--_$em_--></x-container></div>");
    });
    it('should render a container with a nested single child', () => {
        let name = "Sarah";
        let itemPatchingData = html `
            <x-item class="item">
                My name is: ${name}
            </x-item>
        `;
        let containerPatchingData = html `
            <x-container class="container">       
                ${itemPatchingData}
            </x-container>
        `;
        const container = document.createElement('div');
        mountNode(container, containerPatchingData);
        const { node: containerNode } = containerPatchingData;
        expect(containerNode.outerHTML).toEqual("<x-container class=\"container\"><!--_$bm_--><x-item class=\"item\">\n                My name is: <!--_$bm_-->Sarah<!--_$em_--></x-item><!--_$em_--></x-container>");
        const { node: itemNode } = itemPatchingData;
        expect(itemNode).toBe((containerNode?.childNodes)[1]);
        expect(itemNode.outerHTML).toEqual("<x-item class=\"item\">\n                My name is: <!--_$bm_-->Sarah<!--_$em_--></x-item>");
        expect(container.outerHTML).toEqual("<div><x-container class=\"container\"><!--_$bm_--><x-item class=\"item\">\n                My name is: <!--_$bm_-->Sarah<!--_$em_--></x-item><!--_$em_--></x-container></div>");
        name = "Mark";
        itemPatchingData = html `
            <x-item class="item">
                My name is: ${name}
            </x-item>
        `;
        let oldPatchingData = containerPatchingData;
        containerPatchingData = html `
            <x-container class="container">       
                ${itemPatchingData}
            </x-container>
        `;
        updateNode(container, oldPatchingData, containerPatchingData);
        expect(container.outerHTML).toEqual("<div><x-container class=\"container\"><!--_$bm_--><x-item class=\"item\">\n                My name is: <!--_$bm_-->Mark<!--_$em_--></x-item><!--_$em_--></x-container></div>");
        itemPatchingData = null;
        oldPatchingData = containerPatchingData;
        containerPatchingData = html `
            <x-container class="container">       
                ${itemPatchingData}
            </x-container>
        `;
        updateNode(container, oldPatchingData, containerPatchingData);
        expect(container.outerHTML).toEqual("<div><x-container class=\"container\"><!--_$bm_--><!--_$em_--></x-container></div>");
        name = "Sarah";
        itemPatchingData = html `
            <x-item class="item">
                My name is: ${name}
            </x-item>
        `;
        oldPatchingData = containerPatchingData;
        containerPatchingData = html `
            <x-container class="container">       
                ${itemPatchingData}
            </x-container>
        `;
        updateNode(container, oldPatchingData, containerPatchingData);
        expect(container.outerHTML).toEqual("<div><x-container class=\"container\"><!--_$bm_--><x-item class=\"item\">\n                My name is: <!--_$bm_-->Sarah<!--_$em_--></x-item><!--_$em_--></x-container></div>");
    });
    it('should render a different child element', () => {
        const name = "Sarah";
        const patchingData = html `<span>${name}</span>`;
        const container = document.createElement('div');
        mountNode(container, patchingData);
        expect(container.outerHTML).toEqual('<div><span><!--_$bm_-->Sarah<!--_$em_--></span></div>');
        const newPatchingData = html `<h1>${name}</h1>`;
        updateNode(container, patchingData, newPatchingData);
        expect(container.outerHTML).toEqual('<div><h1><!--_$bm_-->Sarah<!--_$em_--></h1></div>');
    });
    it('should render a conditional element', () => {
        let name = "Jorge";
        let patchingData = html `${name === "Sarah" ? html `<span style="color: green;">Special for Sarah</span>` : null}`;
        const container = document.createElement('div');
        mountNode(container, patchingData);
        expect(container.outerHTML).toEqual('<div><!--_$bm_--><!--_$em_--></div>');
        name = "Sarah";
        let newPatchingData = html `${name === "Sarah" ? html `<span style="color: green;">Special for Sarah</span>` : null}`;
        updateNode(container, patchingData, newPatchingData);
        expect(container.outerHTML).toEqual("<div><!--_$bm_--><span style=\"color: green;\">Special for Sarah</span><!--_$em_--></div>");
        patchingData = newPatchingData;
        name = "Jorge";
        newPatchingData = html `${name === "Sarah" ? html `<span style="color: green;">Special for Sarah</span>` : null}`;
        updateNode(container, patchingData, newPatchingData);
        expect(container.outerHTML).toEqual("<div><!--_$bm_--><!--_$em_--></div>");
    });
    it('should render a container with nested children', () => {
        let names = ["Sarah", "Mark", "Sasha"];
        let itemsPatchingData = names.map(name => html `
            <x-item class="item">
                My name is: ${name}
            </x-item>
        `);
        let containerPatchingData = html `
            <x-container class="container">       
                ${itemsPatchingData}
            </x-container>
        `;
        const container = document.createElement('div');
        mountNode(container, containerPatchingData);
        const { node: containerNode } = containerPatchingData;
        expect(containerNode.outerHTML).toEqual("<x-container class=\"container\"><!--_$bm_--><x-item class=\"item\">\n                My name is: <!--_$bm_-->Sarah<!--_$em_--></x-item><x-item class=\"item\">\n                My name is: <!--_$bm_-->Mark<!--_$em_--></x-item><x-item class=\"item\">\n                My name is: <!--_$bm_-->Sasha<!--_$em_--></x-item><!--_$em_--></x-container>");
        names = ["Mark", "Sasha", "Sarah"];
        itemsPatchingData = names.map(name => html `
            <x-item class="item">
                My name is: ${name}
            </x-item>
        `);
        let oldPatchingData = containerPatchingData;
        containerPatchingData = html `
            <x-container class="container">       
                ${itemsPatchingData}
            </x-container>
        `;
        updateNode(container, oldPatchingData, containerPatchingData);
        expect(container.outerHTML).toEqual("<div><x-container class=\"container\"><!--_$bm_--><x-item class=\"item\">\n                My name is: <!--_$bm_-->Mark<!--_$em_--></x-item><x-item class=\"item\">\n                My name is: <!--_$bm_-->Sasha<!--_$em_--></x-item><x-item class=\"item\">\n                My name is: <!--_$bm_-->Sarah<!--_$em_--></x-item><!--_$em_--></x-container></div>");
        itemsPatchingData = null;
        oldPatchingData = containerPatchingData;
        containerPatchingData = html `
            <x-container class="container">       
                ${itemsPatchingData}
            </x-container>
        `;
        updateNode(container, oldPatchingData, containerPatchingData);
        expect(container.outerHTML).toEqual("<div><x-container class=\"container\"><!--_$bm_--><!--_$em_--></x-container></div>");
    });
    it('should attach boolean attributes to the DOM node', () => {
        let isCool = true;
        const container = document.createElement('div');
        let patchingData = html `<span cool=${isCool}></span>`;
        mountNode(container, patchingData);
        expect(container.outerHTML).toEqual("<div><span cool=\"\"></span></div>");
        const { patcher, rules, values } = patchingData;
        expect(values).toEqual([true]);
        const { content } = patcher.template;
        expect(content).toBeInstanceOf(DocumentFragment);
        expect(content.childNodes[0].outerHTML).toEqual("<span cool=\"_$attr:cool\"></span>");
        expect(rules?.length).toEqual(1);
        const rule = (rules || [])[0];
        expect(rule.type).toEqual(NodePatcherRuleTypes.PATCH_ATTRIBUTE);
        expect(rule.name).toEqual('cool');
        const child = container.children[0];
        expect(rule.node).toEqual(child);
        expect(child.attributes.length).toEqual(1);
        expect(child.getAttribute('cool')).toEqual('');
        isCool = null;
        let newPatchingData = html `<span cool=${isCool}></span>`;
        updateNode(container, patchingData, newPatchingData);
        expect(container.outerHTML).toEqual("<div><span></span></div>");
        expect(child.attributes.length).toEqual(0);
        isCool = true;
        patchingData = newPatchingData;
        newPatchingData = html `<span cool=${isCool}></span>`;
        updateNode(container, patchingData, newPatchingData);
        expect(container.outerHTML).toEqual("<div><span cool=\"\"></span></div>");
        expect(child.attributes.length).toEqual(1);
        expect(child.getAttribute('cool')).toEqual('');
        isCool = false;
        patchingData = newPatchingData;
        newPatchingData = html `<span cool=${isCool}></span>`;
        updateNode(container, patchingData, newPatchingData);
        expect(container.outerHTML).toEqual("<div><span></span></div>");
        expect(child.attributes.length).toEqual(0);
    });
    it('should attach attributes of type function to the DOM node', () => {
        let doSomething = () => {
            console.log('Doing something');
        };
        const container = document.createElement('div');
        let patchingData = html `<span action=${doSomething}></span>`;
        mountNode(container, patchingData);
        expect(container.outerHTML).toEqual("<div><span></span></div>");
        const { patcher, rules, values } = patchingData;
        expect(values).toEqual([doSomething]);
        const { content } = patcher.template;
        expect(content).toBeInstanceOf(DocumentFragment);
        expect(content.childNodes[0].outerHTML).toEqual("<span action=\"_$attr:action\"></span>");
        expect(rules?.length).toEqual(1);
        const rule = (rules || [])[0];
        expect(rule.type).toEqual(NodePatcherRuleTypes.PATCH_ATTRIBUTE);
        expect(rule.name).toEqual('action');
        const child = container.children[0];
        expect(rule.node).toEqual(child);
        expect(child.attributes.length).toEqual(0);
        doSomething = null;
        let newPatchingData = html `<span action=${doSomething}></span>`;
        updateNode(container, patchingData, newPatchingData);
        expect(container.outerHTML).toEqual("<div><span></span></div>");
        expect(child.attributes.length).toEqual(0);
        doSomething = () => {
            console.log('Doing something');
        };
        patchingData = newPatchingData;
        newPatchingData = html `<span action=${doSomething}></span>`;
        updateNode(container, patchingData, newPatchingData);
        expect(container.outerHTML).toEqual("<div><span></span></div>");
        expect(child.attributes.length).toEqual(0);
    });
    it('should attach attributes to the DOM node as a special "value" attribute', () => {
        let value = 5;
        const container = document.createElement('div');
        let patchingData = html `<span value=${value}></span>`;
        mountNode(container, patchingData);
        expect(container.outerHTML).toEqual("<div><span value=\"5\"></span></div>");
        const { patcher, rules, values } = patchingData;
        expect(values).toEqual([5]);
        const { content } = patcher.template;
        expect(content).toBeInstanceOf(DocumentFragment);
        expect(content.childNodes[0].outerHTML).toEqual("<span value=\"_$attr:value\"></span>");
        expect(rules?.length).toEqual(1);
        const rule = (rules || [])[0];
        expect(rule.type).toEqual(NodePatcherRuleTypes.PATCH_ATTRIBUTE);
        expect(rule.name).toEqual('value');
        const child = container.children[0];
        expect(rule.node).toEqual(child);
        expect(child.attributes.length).toEqual(1);
        expect(child.getAttribute('value')).toEqual('5');
        value = null;
        let newPatchingData = html `<span value=${value}></span>`;
        updateNode(container, patchingData, newPatchingData);
        expect(container.outerHTML).toEqual("<div><span></span></div>");
        expect(child.attributes.length).toEqual(0);
        value = 10;
        patchingData = newPatchingData;
        newPatchingData = html `<span value=${value}></span>`;
        updateNode(container, patchingData, newPatchingData);
        expect(container.outerHTML).toEqual("<div><span value=\"10\"></span></div>");
        expect(child.attributes.length).toEqual(1);
        expect(child.getAttribute('value')).toEqual('10');
    });
    it('should attach events to the DOM node and remove the function name from the markup', () => {
        const handler = () => {
            console.log('Handling it');
        };
        const container = document.createElement('div');
        let patchingData = html `<span onClick=${handler}></span>`;
        mountNode(container, patchingData);
        expect(container.outerHTML).toEqual("<div><span></span></div>");
        const { patcher, rules, values } = patchingData;
        expect(values).toEqual([handler]);
        const { content } = patcher.template;
        expect(content).toBeInstanceOf(DocumentFragment);
        expect(content.childNodes[0].outerHTML).toEqual('<span onclick=\"_$evt:onClick\"></span>');
        expect(rules?.length).toEqual(1);
        const rule = (rules || [])[0];
        expect(rule.type).toEqual(NodePatcherRuleTypes.PATCH_EVENT);
        expect(rule.name).toEqual('onClick');
        const child = container.children[0];
        expect(rule.node).toEqual(child);
        expect(child.attributes.length).toEqual(0);
        expect(child._listeners['click']).toEqual([handler]);
        const newHandler = null;
        let newPatchingData = html `<span onClick=${newHandler}></span>`;
        updateNode(container, patchingData, newPatchingData);
        expect(container.outerHTML).toEqual("<div><span></span></div>");
        expect(child._listeners['click']).toEqual([]);
        patchingData = newPatchingData;
        newPatchingData = html `<span onClick=${handler}></span>`;
        updateNode(container, patchingData, newPatchingData);
        expect(container.outerHTML).toEqual("<div><span></span></div>");
        expect(child._listeners['click']).toEqual([handler]);
    });
    it('should attach events to the DOM node, remove the function name from the markup and find the function in the window object.', () => {
        window.handleClick = () => {
            console.log('Handling it');
        };
        const handler = "handleClick()";
        let patchingData = html `<span onClick=${handler}></span>`;
        const container = document.createElement('div');
        mountNode(container, patchingData);
        expect(container.outerHTML).toEqual("<div><span></span></div>");
        const { patcher, rules, values } = patchingData;
        expect(values).toEqual([handler]);
        const { content } = patcher.template;
        expect(content).toBeInstanceOf(DocumentFragment);
        expect(content.childNodes[0].outerHTML).toEqual('<span onclick=\"_$evt:onClick\"></span>');
        expect(rules?.length).toEqual(1);
        const rule = (rules || [])[0];
        expect(rule.type).toEqual(NodePatcherRuleTypes.PATCH_EVENT);
        expect(rule.name).toEqual('onClick');
        const child = container.children[0];
        expect(rule.node).toEqual(child);
        expect(child.attributes.length).toEqual(0);
        expect(child._listeners['click']).toEqual([window.handleClick]);
        const newHandler = null;
        let newPatchingData = html `<span onClick=${newHandler}></span>`;
        updateNode(container, patchingData, newPatchingData);
        expect(container.outerHTML).toEqual("<div><span></span></div>");
        expect(child._listeners['click']).toEqual([]);
        patchingData = newPatchingData;
        newPatchingData = html `<span onClick=${handler}></span>`;
        updateNode(container, patchingData, newPatchingData);
        expect(container.outerHTML).toEqual("<div><span></span></div>");
        expect(child._listeners['click']).toEqual([window.handleClick]);
    });
    it('should render a complex object with children', () => {
        let data = {
            name: "Sarah",
            age: 19,
            description: "Smart and beautiful",
            skills: [
                {
                    id: 1,
                    description: 'Artist'
                },
                {
                    id: 2,
                    description: 'Medicine'
                }
            ]
        };
        let patchingData = html `<div style="width: 200px; margin: 10px;">
            <div style="background-color: lightgreen; padding: 5px;">${data.name}</div>
            <div style="background-color: yellow;">${data.age}</div>
            <div style="background-color: darkred; color: white; font-weight: bold;">${data.description}</div>
            <gcs-data-list id-field="id" data=${data.skills}></gcs-data-list>
        </div>`;
        const container = document.createElement('div');
        mountNode(container, patchingData);
        expect(container.outerHTML).toEqual("<div><div style=\"width: 200px; margin: 10px;\">\n            <div style=\"background-color: lightgreen; padding: 5px;\"><!--_$bm_-->Sarah<!--_$em_--></div>\n            <div style=\"background-color: yellow;\"><!--_$bm_-->19<!--_$em_--></div>\n            <div style=\"background-color: darkred; color: white; font-weight: bold;\"><!--_$bm_-->Smart and beautiful<!--_$em_--></div>\n            <gcs-data-list id-field=\"id\"></gcs-data-list>\n        </div></div>");
        data = {
            name: "Mark",
            age: 31,
            description: "Hard worker",
            skills: [
                {
                    id: 1,
                    description: 'Marketing'
                },
                {
                    id: 2,
                    description: 'Finance'
                }
            ]
        };
        const newPatchingData = html `<div style="width: 200px; margin: 10px;">
            <div style="background-color: lightgreen; padding: 5px;">${data.name}</div>
            <div style="background-color: yellow;">${data.age}</div>
            <div style="background-color: darkred; color: white; font-weight: bold;">${data.description}</div>
            <gcs-data-list id-field="id" data=${data.skills}></gcs-data-list>
        </div>`;
        updateNode(container, patchingData, newPatchingData);
        expect(container.outerHTML).toEqual("<div><div style=\"width: 200px; margin: 10px;\">\n            <div style=\"background-color: lightgreen; padding: 5px;\"><!--_$bm_-->Mark<!--_$em_--></div>\n            <div style=\"background-color: yellow;\"><!--_$bm_-->31<!--_$em_--></div>\n            <div style=\"background-color: darkred; color: white; font-weight: bold;\"><!--_$bm_-->Hard worker<!--_$em_--></div>\n            <gcs-data-list id-field=\"id\"></gcs-data-list>\n        </div></div>");
        patchingData = newPatchingData;
    });
    it('should render a complex object with children and undefined attributes', () => {
        let data = {
            name: "Sarah",
            description: "Smart and beautiful",
            skills: [
                {
                    id: 1,
                    description: 'Artist'
                },
                {
                    id: 2,
                }
            ]
        };
        let patchingData = html `<div style="width: 200px; margin: 10px;">
            <div style="background-color: lightgreen; padding: 5px;">${data.name}</div>
            <div style="background-color: yellow;">${data.age}</div>
            <div style="background-color: darkred; color: white; font-weight: bold;">${data.description}</div>
            <gcs-data-list id-field="id" data=${data.skills}></gcs-data-list>
        </div>`;
        const container = document.createElement('div');
        mountNode(container, patchingData);
        expect(container.outerHTML).toEqual("<div><div style=\"width: 200px; margin: 10px;\">\n            <div style=\"background-color: lightgreen; padding: 5px;\"><!--_$bm_-->Sarah<!--_$em_--></div>\n            <div style=\"background-color: yellow;\"><!--_$bm_--><!--_$em_--></div>\n            <div style=\"background-color: darkred; color: white; font-weight: bold;\"><!--_$bm_-->Smart and beautiful<!--_$em_--></div>\n            <gcs-data-list id-field=\"id\"></gcs-data-list>\n        </div></div>");
        data = {
            name: "Mark",
            age: 31,
            skills: [
                {
                    id: 1,
                },
                {
                    id: 2,
                    description: 'Finance'
                }
            ]
        };
        const newPatchingData = html `<div style="width: 200px; margin: 10px;">
            <div style="background-color: lightgreen; padding: 5px;">${data.name}</div>
            <div style="background-color: yellow;">${data.age}</div>
            <div style="background-color: darkred; color: white; font-weight: bold;">${data.description}</div>
            <gcs-data-list id-field="id" data=${data.skills}></gcs-data-list>
        </div>`;
        updateNode(container, patchingData, newPatchingData);
        expect(container.outerHTML).toEqual("<div><div style=\"width: 200px; margin: 10px;\">\n            <div style=\"background-color: lightgreen; padding: 5px;\"><!--_$bm_-->Mark<!--_$em_--></div>\n            <div style=\"background-color: yellow;\"><!--_$bm_-->31<!--_$em_--></div>\n            <div style=\"background-color: darkred; color: white; font-weight: bold;\"><!--_$bm_--><!--_$em_--></div>\n            <gcs-data-list id-field=\"id\"></gcs-data-list>\n        </div></div>");
        patchingData = newPatchingData;
    });
    it('should render a collection of non keyed complex objects with children', () => {
        let data = [
            {
                name: "Sarah",
                age: 19,
                description: "Smart and beautiful",
                skills: [
                    {
                        id: 1,
                        description: 'Artist'
                    },
                    {
                        id: 2,
                        description: 'Medicine'
                    }
                ]
            },
            {
                name: "Mark",
                age: 31,
                description: "Hard worker",
                skills: [
                    {
                        id: 3,
                        description: 'Marketing'
                    },
                    {
                        id: 4,
                        description: 'Finance'
                    }
                ]
            }
        ];
        const renderItems = (data) => data.map(d => html `<div style="width: 200px; margin: 10px;">
            <div style="background-color: lightgreen; padding: 5px;">${d.name}</div>
            <div style="background-color: yellow;">${d.age}</div>
            <div style="background-color: darkred; color: white; font-weight: bold;">${d.description}</div>
            <gcs-data-list id-field="id" data=${d.skills}></gcs-data-list>
        </div>`);
        let patchingData = renderItems(data);
        const container = document.createElement('div');
        mountNodes(container, patchingData);
        expect(container.outerHTML).toEqual("<div><div style=\"width: 200px; margin: 10px;\">\n            <div style=\"background-color: lightgreen; padding: 5px;\"><!--_$bm_-->Sarah<!--_$em_--></div>\n            <div style=\"background-color: yellow;\"><!--_$bm_-->19<!--_$em_--></div>\n            <div style=\"background-color: darkred; color: white; font-weight: bold;\"><!--_$bm_-->Smart and beautiful<!--_$em_--></div>\n            <gcs-data-list id-field=\"id\"></gcs-data-list>\n        </div><div style=\"width: 200px; margin: 10px;\">\n            <div style=\"background-color: lightgreen; padding: 5px;\"><!--_$bm_-->Mark<!--_$em_--></div>\n            <div style=\"background-color: yellow;\"><!--_$bm_-->31<!--_$em_--></div>\n            <div style=\"background-color: darkred; color: white; font-weight: bold;\"><!--_$bm_-->Hard worker<!--_$em_--></div>\n            <gcs-data-list id-field=\"id\"></gcs-data-list>\n        </div></div>");
        data = [
            {
                name: "Sarah",
                age: 19,
                description: "Smart and awesome",
                skills: [
                    {
                        id: 5,
                        description: 'Makeup'
                    },
                    {
                        id: 2,
                        description: 'Medicine'
                    }
                ]
            },
            {
                name: "Mark",
                age: 31,
                description: "Hard worker and dedicated",
                skills: [
                    {
                        id: 7,
                        description: 'Entrepeneur'
                    },
                    {
                        id: 8,
                        description: 'Salesperson'
                    }
                ]
            }
        ];
        const newPatchingData = renderItems(data);
        updateNodes(container, patchingData, newPatchingData);
        expect(container.outerHTML).toEqual("<div><div style=\"width: 200px; margin: 10px;\">\n            <div style=\"background-color: lightgreen; padding: 5px;\"><!--_$bm_-->Sarah<!--_$em_--></div>\n            <div style=\"background-color: yellow;\"><!--_$bm_-->19<!--_$em_--></div>\n            <div style=\"background-color: darkred; color: white; font-weight: bold;\"><!--_$bm_-->Smart and awesome<!--_$em_--></div>\n            <gcs-data-list id-field=\"id\"></gcs-data-list>\n        </div><div style=\"width: 200px; margin: 10px;\">\n            <div style=\"background-color: lightgreen; padding: 5px;\"><!--_$bm_-->Mark<!--_$em_--></div>\n            <div style=\"background-color: yellow;\"><!--_$bm_-->31<!--_$em_--></div>\n            <div style=\"background-color: darkred; color: white; font-weight: bold;\"><!--_$bm_-->Hard worker and dedicated<!--_$em_--></div>\n            <gcs-data-list id-field=\"id\"></gcs-data-list>\n        </div></div>");
        patchingData = newPatchingData;
    });
    it('should render a collection of keyed complex objects with children', () => {
        let data = [
            {
                id: 'a',
                name: "Sarah",
                age: 19,
                description: "Smart and beautiful",
                skills: [
                    {
                        id: 1,
                        description: 'Artist'
                    },
                    {
                        id: 2,
                        description: 'Medicine'
                    }
                ]
            },
            {
                id: 'b',
                name: "Mark",
                age: 31,
                description: "Hard worker",
                skills: [
                    {
                        id: 3,
                        description: 'Marketing'
                    },
                    {
                        id: 4,
                        description: 'Finance'
                    }
                ]
            }
        ];
        const renderItems = (data) => data.map(d => html `<div key=${d.id} style="width: 200px; margin: 10px;">
            <div style="background-color: lightgreen; padding: 5px;">${d.name}</div>
            <div style="background-color: yellow;">${d.age}</div>
            <div style="background-color: darkred; color: white; font-weight: bold;">${d.description}</div>
            <gcs-data-list id-field="id" data=${d.skills}></gcs-data-list>
        </div>`);
        let patchingData = renderItems(data);
        const container = document.createElement('div');
        mountNodes(container, patchingData);
        expect(container.outerHTML).toEqual("<div><div key=\"a\" style=\"width: 200px; margin: 10px;\">\n            <div style=\"background-color: lightgreen; padding: 5px;\"><!--_$bm_-->Sarah<!--_$em_--></div>\n            <div style=\"background-color: yellow;\"><!--_$bm_-->19<!--_$em_--></div>\n            <div style=\"background-color: darkred; color: white; font-weight: bold;\"><!--_$bm_-->Smart and beautiful<!--_$em_--></div>\n            <gcs-data-list id-field=\"id\"></gcs-data-list>\n        </div><div key=\"b\" style=\"width: 200px; margin: 10px;\">\n            <div style=\"background-color: lightgreen; padding: 5px;\"><!--_$bm_-->Mark<!--_$em_--></div>\n            <div style=\"background-color: yellow;\"><!--_$bm_-->31<!--_$em_--></div>\n            <div style=\"background-color: darkred; color: white; font-weight: bold;\"><!--_$bm_-->Hard worker<!--_$em_--></div>\n            <gcs-data-list id-field=\"id\"></gcs-data-list>\n        </div></div>");
        data = [
            {
                id: 'a',
                name: "Sarah",
                age: 19,
                description: "Smart and awesome",
                skills: [
                    {
                        id: 5,
                        description: 'Makeup'
                    },
                    {
                        id: 2,
                        description: 'Medicine'
                    }
                ]
            },
            {
                id: 'b',
                name: "Mark",
                age: 31,
                description: "Hard worker and dedicated",
                skills: [
                    {
                        id: 7,
                        description: 'Entrepeneur'
                    },
                    {
                        id: 8,
                        description: 'Salesperson'
                    }
                ]
            }
        ];
        const newPatchingData = renderItems(data);
        updateNodes(container, patchingData, newPatchingData);
        expect(container.outerHTML).toEqual("<div><div key=\"a\" style=\"width: 200px; margin: 10px;\">\n            <div style=\"background-color: lightgreen; padding: 5px;\"><!--_$bm_-->Sarah<!--_$em_--></div>\n            <div style=\"background-color: yellow;\"><!--_$bm_-->19<!--_$em_--></div>\n            <div style=\"background-color: darkred; color: white; font-weight: bold;\"><!--_$bm_-->Smart and awesome<!--_$em_--></div>\n            <gcs-data-list id-field=\"id\"></gcs-data-list>\n        </div><div key=\"b\" style=\"width: 200px; margin: 10px;\">\n            <div style=\"background-color: lightgreen; padding: 5px;\"><!--_$bm_-->Mark<!--_$em_--></div>\n            <div style=\"background-color: yellow;\"><!--_$bm_-->31<!--_$em_--></div>\n            <div style=\"background-color: darkred; color: white; font-weight: bold;\"><!--_$bm_-->Hard worker and dedicated<!--_$em_--></div>\n            <gcs-data-list id-field=\"id\"></gcs-data-list>\n        </div></div>");
        patchingData = newPatchingData;
    });
    it('should render two conditional elements side by side', () => {
        let name = "Jorge";
        let age = 55;
        let patchingData = html `${name === "Sarah" ? html `<span style="color: green;">Special for Sarah</span>` : null}
            ${age < 50 ? html `<span style="color: green;">You are too young</span>` : null}`;
        const container = document.createElement('div');
        mountNode(container, patchingData);
        expect(container.outerHTML).toEqual("<div><!--_$bm_--><!--_$em_--><!--_$bm_--><!--_$em_--></div>");
        name = "Sarah";
        age = 19;
        let newPatchingData = html `${name === "Sarah" ? html `<span style="color: green;">Special for Sarah</span>` : null}
            ${age < 50 ? html `<span style="color: green;">You are too young</span>` : null}`;
        updateNode(container, patchingData, newPatchingData);
        expect(container.outerHTML).toEqual("<div><!--_$bm_--><span style=\"color: green;\">Special for Sarah</span><!--_$em_--><!--_$bm_--><span style=\"color: green;\">You are too young</span><!--_$em_--></div>");
        patchingData = newPatchingData;
        name = "Jorge";
        age = 45;
        newPatchingData = html `${name === "Sarah" ? html `<span style="color: green;">Special for Sarah</span>` : null}
            ${age < 50 ? html `<span style="color: green;">You are too young</span>` : null}`;
        updateNode(container, patchingData, newPatchingData);
        expect(container.outerHTML).toEqual("<div><!--_$bm_--><!--_$em_--><!--_$bm_--><span style=\"color: green;\">You are too young</span><!--_$em_--></div>");
        name = "Jorge";
        age = 55;
        newPatchingData = html `${name === "Sarah" ? html `<span style="color: green;">Special for Sarah</span>` : null}
            ${age < 50 ? html `<span style="color: green;">You are too young</span>` : null}`;
        updateNode(container, patchingData, newPatchingData);
        expect(container.outerHTML).toEqual("<div><!--_$bm_--><!--_$em_--><!--_$bm_--><!--_$em_--></div>");
    });
    it('should transition from two conditional elements side by side to a single one', () => {
        let name = "Jorge";
        const age = 55;
        let patchingData = html `${name === "Sarah" ? html `<span style="color: green;">Special for Sarah</span>` : null}
        ${age < 50 ? html `<span style="color: green;">You are too young</span>` : null}`;
        const container = document.createElement('div');
        mountNode(container, patchingData);
        expect(container.outerHTML).toEqual("<div><!--_$bm_--><!--_$em_--><!--_$bm_--><!--_$em_--></div>");
        name = "Sarah";
        let newPatchingData = html `${name === "Sarah" ? html `<span style="color: green;">Special for Sarah</span>` : null}`;
        updateNode(container, patchingData, newPatchingData);
        expect(container.outerHTML).toEqual("<div><!--_$bm_--><span style=\"color: green;\">Special for Sarah</span><!--_$em_--><!--_$bm_--><!--_$em_--></div>");
        patchingData = newPatchingData;
        name = "Jorge";
        newPatchingData = html `${name === "Sarah" ? html `<span style="color: green;">Special for Sarah</span>` : null}`;
        updateNode(container, patchingData, newPatchingData);
        expect(container.outerHTML).toEqual("<div><!--_$bm_--><!--_$em_--><!--_$bm_--><!--_$em_--></div>");
    });
    it('should throw an error if the placeholder is surrounded by double quotes', () => {
        const icon = "person";
        expect(() => html `<gcs-icon name="${icon}"></gcs-icon>`)
            .toThrow(new Error("Do not surround the placeholder for an attribute with single or double quotes or template a partial attribute"));
    });
    it('should throw an error if the placeholder is surrounded by double quotes because of an illegal attribute fragment (end)', () => {
        const icon = "person";
        expect(() => html `<gcs-icon name="my-${icon}"></gcs-icon>`)
            .toThrow(new Error("Do not surround the placeholder for an attribute with single or double quotes or template a partial attribute"));
    });
    it('should throw an error if the placeholder is surrounded by double quotes because of an illegal attribute fragment (begin)', () => {
        const icon = "person";
        expect(() => html `<gcs-icon name="${icon}-1"></gcs-icon>`)
            .toThrow(new Error("Do not surround the placeholder for an attribute with single or double quotes or template a partial attribute"));
    });
    it('should throw an error if the placeholder is surrounded by double quotes because of an illegal attribute fragment (middle)', () => {
        const icon = "person";
        expect(() => html `<gcs-icon name="my-${icon}-1"></gcs-icon>`)
            .toThrow(new Error("Do not surround the placeholder for an attribute with single or double quotes or template a partial attribute"));
    });
    it('should throw an error if the placeholder is surrounded by single quotes', () => {
        const icon = "person";
        expect(() => html `<gcs-icon name='${icon}'></gcs-icon>`)
            .toThrow(new Error("Do not surround the placeholder for an attribute with single or double quotes or template a partial attribute"));
    });
    it('should render two conditional child elements', () => {
        let name = "Jorge";
        let age = 55;
        let patchingData = html `<div>
            <span slot="header">${renderHeader(name, age)}</span>
        </div>`;
        function renderHeader(name, age) {
            if (age > 50) {
                return html `<span style="color: yellow;">${name} - ${age} years</span>`;
            }
            else {
                return html `<span style="color: green;">${name} - ${age} years</span>`;
            }
        }
        const container = document.createElement('div');
        mountNode(container, patchingData);
        expect(container.outerHTML).toEqual("<div><div>\n            <span slot=\"header\"><!--_$bm_--><span style=\"color: yellow;\"><!--_$bm_-->Jorge<!--_$em_--> - <!--_$bm_-->55<!--_$em_--> years</span><!--_$em_--></span>\n        </div></div>");
        name = "Sarah";
        age = 20;
        let newPatchingData = html `<div>
            <span slot="header">${renderHeader(name, age)}</span>
        </div>`;
        updateNode(container, patchingData, newPatchingData);
        expect(container.outerHTML).toEqual("<div><div>\n            <span slot=\"header\"><!--_$bm_--><span style=\"color: green;\"><!--_$bm_-->Sarah<!--_$em_--> - <!--_$bm_-->20<!--_$em_--> years</span><!--_$em_--></span>\n        </div></div>");
        patchingData = newPatchingData;
        name = "Jorge";
        age = 45;
        newPatchingData = html `<div>
            <span slot="header">${renderHeader(name, age)}</span>
        </div>`;
        updateNode(container, patchingData, newPatchingData);
        expect(container.outerHTML).toEqual("<div><div>\n            <span slot=\"header\"><!--_$bm_--><span style=\"color: green;\"><!--_$bm_-->Jorge<!--_$em_--> - <!--_$bm_-->45<!--_$em_--> years</span><!--_$em_--></span>\n        </div></div>");
        name = "Jorge";
        age = 55;
        newPatchingData = html `${name === "Sarah" ? html `<span style="color: green;">Special for Sarah</span>` : null}
            ${age < 50 ? html `<span style="color: green;">You are too young</span>` : null}`;
        updateNode(container, patchingData, newPatchingData);
        expect(container.outerHTML).toEqual("<div><!--_$bm_--><!--_$em_--><!--_$bm_--><!--_$em_--></div>");
    });
    it('should transition from one element to a collection of items', () => {
        const patchingData = html `<span>Single element</span>`;
        const container = document.createElement('div');
        mountNode(container, patchingData);
        expect(container.outerHTML).toEqual("<div><span>Single element</span></div>");
        const newPatchingData = ['Sarah', 'Mark', 'Sasha', 'Zoe'].map((name) => html `<span>${name}</span>`);
        updateNode(container, patchingData, newPatchingData);
        expect(container.outerHTML).toEqual("<div><span><!--_$bm_-->Sarah<!--_$em_--></span><span><!--_$bm_-->Mark<!--_$em_--></span><span><!--_$bm_-->Sasha<!--_$em_--></span><span><!--_$bm_-->Zoe<!--_$em_--></span></div>");
    });
    it('should transition from a collection of items to one element', () => {
        const patchingData = ['Sarah', 'Mark', 'Sasha', 'Zoe'].map((name) => html `<span>${name}</span>`);
        const container = document.createElement('div');
        mountNodes(container, patchingData);
        expect(container.outerHTML).toEqual("<div><span><!--_$bm_-->Sarah<!--_$em_--></span><span><!--_$bm_-->Mark<!--_$em_--></span><span><!--_$bm_-->Sasha<!--_$em_--></span><span><!--_$bm_-->Zoe<!--_$em_--></span></div>");
        const newPatchingData = html `<span>Single element</span>`;
        updateNodes(container, patchingData, newPatchingData);
        expect(container.outerHTML).toEqual("<div><span>Single element</span></div>");
    });
});
//# sourceMappingURL=renderNodes.spec.js.map