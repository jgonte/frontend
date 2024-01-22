import CustomHTMLElementConstructor from "./metadata/types/CustomHTMLElementConstructor";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { mountNode, mountNodes } from "../../rendering/nodes/mountNodes";
import { updateNode, updateNodes } from "../../rendering/nodes/updateNodes";
import CustomHTMLElement from "./metadata/types/CustomHTMLElement";
import { DataTypes } from "../../utils/data/DataTypes";
import CustomElementPropertyMetadata from "./metadata/types/CustomElementPropertyMetadata";

/**
 * Updates the element by patching the nodes
 * @param Base 
 * @returns 
 */
export default function NodePatching<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class NodePatchingMixin extends Base {

        /**
         * The old patching node data to patch against
         */
        private _oldPatchingData: NodePatchingData | NodePatchingData[] | null = null;

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                /**
                 * The key to help with patching a collection
                 */
                key: {
                    type: DataTypes.String
                }
            };
        }

        async updateDom(): Promise<void> {

            try {

                let newPd = await this.render();

                if (newPd !== null) { // Only if there is something to render

                    newPd = this.beforeRender(newPd); // Modify the original patching data if needed
                }

                const {
                    document,
                    _oldPatchingData: oldPd
                } = this;

                if (oldPd === null) {

                    if (newPd !== null) { // Mount

                        await this.mountDom(document, newPd);
                    }
                    // else newPatchingData === null - Nothing to do
                }
                else { // this._oldPatchingData !== null

                    if (newPd !== null) { // Update

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
                    else { // newPatchingData === null - Unmount

                        this.willUnmountCallback?.();

                        (this.document as HTMLElement).replaceChildren(); // Remove all the existing children

                        this.stylesAdded = false; // Need to re-add the styles
                    }
                }

                this._oldPatchingData = newPd;
            }
            catch (error) {

                console.error(error);
            }
        }

        async mountDom(document: HTMLElement | ShadowRoot, newPatchingData: NodePatchingData | NodePatchingData[]) {

            if (Array.isArray(newPatchingData)) {

                mountNodes(document, newPatchingData);
            }
            else {

                mountNode(document, newPatchingData);
            }

            await this._waitForChildrenToMount();

            this.callAfterUpdate();
        }

        /**
         * Wait for the children to mount before this (parent)
         */
        private async _waitForChildrenToMount(): Promise<void> {

            await this._waitForChildren();

            this.didMountCallback?.();
        }

        /**
         * Wait for the children to update before this (parent)
         */
        private async _waitForChildrenToUpdate(): Promise<void> {

            await this._waitForChildren();

            this.didUpdateCallback?.();
        }

        private async _waitForChildren() {

            const updatePromises = [...this.adoptedChildren]
                .map(child => (child as CustomHTMLElement).updateComplete);

            if (updatePromises.length > 0) {

                await Promise.all(updatePromises);
            }
        }
    }
}