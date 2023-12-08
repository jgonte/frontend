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
            if (shadowRoot !== null) {
                const styleNode = document.createElement('style');
                const styleContent = document.createTextNode(styles);
                styleNode.appendChild(styleContent);
                shadowRoot.appendChild(styleNode);
            }
            else {
                throw new Error('Not implemented');
            }
            return node;
        }
    };
}
//# sourceMappingURL=StylesPatching.js.map