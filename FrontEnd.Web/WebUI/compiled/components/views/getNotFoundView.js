import html from "../../rendering/html";
export default function getNotFoundView() {
    return class {
        render() {
            return html `
<h1>404 - Not found</h1>
<p>Sorry :-(</p>`;
        }
    };
}
//# sourceMappingURL=getNotFoundView.js.map