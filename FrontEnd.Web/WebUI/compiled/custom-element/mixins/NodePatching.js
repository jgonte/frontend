import mountNodes from "../../rendering/nodes/mountNodes";
import updateNodes from "../../rendering/nodes/updateNodes";
import { DataTypes } from "../../utils/data/DataTypes";
export default function NodePatching(Base) {
    return class NodePatchingMixin extends Base {
        _oldPatchingData = null;
        static get properties() {
            return {
                key: {
                    type: DataTypes.String
                }
            };
        }
        async updateDom() {
            try {
                let newPatchingData = await this.render();
                if (newPatchingData !== null) {
                    newPatchingData = this.beforeRender(newPatchingData);
                }
                const { document, _oldPatchingData } = this;
                if (_oldPatchingData === null) {
                    if (newPatchingData !== null) {
                        await this.mountDom(document, newPatchingData);
                    }
                }
                else {
                    if (newPatchingData !== null) {
                        this.willUpdateCallback?.();
                        updateNodes(document, _oldPatchingData, newPatchingData);
                        await this._waitForChildrenToUpdate();
                        this.callAfterUpdate();
                    }
                    else {
                        this.willUnmountCallback?.();
                        this.document.replaceChildren();
                        this.stylesAdded = false;
                    }
                }
                this._oldPatchingData = newPatchingData;
            }
            catch (error) {
                console.error(error);
            }
        }
        async mountDom(document, newPatchingData) {
            mountNodes(document, newPatchingData);
            await this._waitForChildrenToMount();
            this.callAfterUpdate();
        }
        async _waitForChildrenToMount() {
            await this._waitForChildren();
            this.didMountCallback?.();
        }
        async _waitForChildrenToUpdate() {
            await this._waitForChildren();
            this.didUpdateCallback?.();
        }
        async _waitForChildren() {
            const updatePromises = [...this.adoptedChildren]
                .map(child => child.updateComplete);
            if (updatePromises.length > 0) {
                await Promise.all(updatePromises);
            }
        }
    };
}
//# sourceMappingURL=NodePatching.js.map