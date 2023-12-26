import html from "../../../rendering/html";
import { DataTypes } from "../../../utils/data/DataTypes";
import Fetcher from "../../../utils/data/transfer/Fetcher";
import notifyError from "../../../services/errors/notifyError";
export default function RemoteLoadableHolder(Base) {
    return class RemoteLoadableHolderMixin extends Base {
        _loadFetcher;
        dataField = 'data';
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
        static get state() {
            return {
                loading: {
                    value: false
                },
                metadata: {}
            };
        }
        renderLoading() {
            if (this.loading === false) {
                return null;
            }
            return html `
<gcs-overlay>
    <gcs-alert kind="info" >
        <gcs-localized-text>...Loading</gcs-localized-text>
    </gcs-alert>
</gcs-overlay>`;
        }
        connectedCallback() {
            super.connectedCallback?.();
            if (this.loadUrl === undefined) {
                return;
            }
            this._loadFetcher = new Fetcher({
                onData: data => this.handleLoadData(data),
                onError: error => this.handleLoadError(error)
            });
            if (this.autoLoad === true) {
                setTimeout(() => this.loadRemote(undefined), 0);
            }
        }
        loadRemote(params) {
            this.loading = true;
            this._loadFetcher?.fetch({
                url: this.loadUrl,
                params
            });
        }
        async handleLoadData(data) {
            await this.updateComplete;
            this.loading = false;
            if (this.metadataKey !== undefined) {
                const header = data.headers.get(this.metadataKey);
                this.metadata = JSON.parse(header);
            }
            this.handleLoadedData(data);
        }
        handleLoadedData(data) {
            this[this.dataField] = data.payload || data;
        }
        async handleLoadError(error) {
            await this.updateComplete;
            this.loading = false;
            notifyError(this, error);
        }
    };
}
//# sourceMappingURL=RemoteLoadable.js.map