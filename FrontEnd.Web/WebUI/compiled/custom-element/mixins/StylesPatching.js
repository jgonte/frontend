export default function StylesPatching(Base) {
    return class StylesPatchingMixin extends Base {
        beforeRender(patchingData) {
            const { constructor, stylesAdded = false } = this;
            const styles = constructor.metadata.styles;
            if (styles !== undefined &&
                stylesAdded === false) {
                patchingData = this.addStyles(patchingData, styles);
                this.stylesAdded = true;
            }
            return patchingData;
        }
        addStyles(node, styles) {
            const { shadowRoot } = this;
            const styleNode = document.createElement('style');
            const styleContent = document.createTextNode(styles);
            styleNode.appendChild(styleContent);
            if (shadowRoot !== null) {
                shadowRoot.appendChild(styleNode);
            }
            else {
                document.body.appendChild(styleNode);
            }
            return node;
        }
    };
}
//# sourceMappingURL=StylesPatching.js.map