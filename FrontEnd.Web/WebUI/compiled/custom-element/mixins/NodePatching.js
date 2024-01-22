import { mountNode, mountNodes } from "../../rendering/nodes/mountNodes";
import { updateNode, updateNodes } from "../../rendering/nodes/updateNodes";
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
                let newPd = await this.render();
                if (newPd !== null) {
                    newPd = this.beforeRender(newPd);
                }
                const { document, _oldPatchingData: oldPd } = this;
                if (oldPd === null) {
                    if (newPd !== null) {
                        await this.mountDom(document, newPd);
                    }
                }
                else {
                    if (newPd !== null) {
                        this.willUpdateCallback?.();
                        if (Array.isArray(oldPd)) {
                            updateNodes(document, oldPd, newPd);
                        }
                        else {
                            updateNode(document, oldPd, newPd);
                        }
                        await this._waitForChildrenToUpdate();
                        this.callAfterUpdate();
                    }
                    else {
                        this.willUnmountCallback?.();
                        this.document.replaceChildren();
                        this.stylesAdded = false;
                    }
                }
                this._oldPatchingData = newPd;
            }
            catch (error) {
                console.error(error);
            }
        }
        async mountDom(document, newPatchingData) {
            if (Array.isArray(newPatchingData)) {
                mountNodes(document, newPatchingData);
            }
            else {
                mountNode(document, newPatchingData);
            }
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