import { DataTypes } from "../../../utils/data/DataTypes";
export default function RemoteLoadableHolderPassthrough(Base) {
    return class RemoteLoadableHolderPassthorughMixin extends Base {
        static get properties() {
            return {
                loadUrl: {
                    attribute: 'load-url',
                    type: DataTypes.String,
                },
                autoLoad: {
                    attribute: 'auto-load',
                    type: DataTypes.Boolean,
                    value: true
                },
                metadataKey: {
                    attribute: 'metadata-key',
                    type: DataTypes.String
                }
            };
        }
    };
}
//# sourceMappingURL=RemoteLoadablePassthrough.js.map