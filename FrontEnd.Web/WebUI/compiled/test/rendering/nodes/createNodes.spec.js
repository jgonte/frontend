import html from "../../../rendering/html";
import createNodes from "../../../rendering/nodes/createNodes";
import { beginMarker, endMarker } from "../../../rendering/template/markers";
describe("create nodes tests", () => {
    it('should create a text node (with a begin and end placeholders)', () => {
        const name = 'Sarah';
        const patchingData = html `${name}`;
        const df = createNodes(patchingData);
        const { childNodes } = df;
        expect(childNodes.length).toEqual(3);
        let comment = childNodes[0];
        expect(comment.nodeType).toEqual(Node.COMMENT_NODE);
        expect(comment.data).toEqual(beginMarker);
        expect(comment._$patchingData).toEqual(patchingData);
        const text = childNodes[1];
        expect(text.nodeType).toEqual(Node.TEXT_NODE);
        expect(text.textContent).toEqual('Sarah');
        comment = childNodes[2];
        expect(comment.nodeType).toEqual(Node.COMMENT_NODE);
        expect(comment.data).toEqual(endMarker);
    });
    it('should trim the starting new line', () => {
        const patchingData = html `
<gcs-alert 
    slot="content"
    kind="warning">
    <gcs-localized-text>No Data Available</gcs-localized-text>
</gcs-alert>`;
        const df = createNodes(patchingData);
        const { childNodes } = df;
        expect(childNodes.length).toEqual(1);
        expect(childNodes[0].tagName).toEqual('WCL-ALERT');
    });
});
//# sourceMappingURL=createNodes.spec.js.map