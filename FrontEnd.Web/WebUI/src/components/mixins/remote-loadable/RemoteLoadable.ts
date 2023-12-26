import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomElementStateMetadata from "../../../custom-element/mixins/metadata/types/CustomElementStateMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import html from "../../../rendering/html";
import { DataTypes } from "../../../utils/data/DataTypes";
import { ErrorResponse } from "../../../utils/data/transfer/ErrorResponse";
import Fetcher from "../../../utils/data/transfer/Fetcher";
import DataResponse from "../../../utils/data/transfer/DataResponse";
import { DynamicObject } from "../../../utils/types";
import notifyError from "../../../services/errors/notifyError";

export default function RemoteLoadableHolder<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class RemoteLoadableHolderMixin extends Base {

        private _loadFetcher?: Fetcher;

        dataField = 'data';

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                /**
                 * The URL to retrieve the data from
                 */
                loadUrl: {
                    attribute: 'load-url',
                    type: DataTypes.String,
                    //required: true Loading the form or other component might be optional
                },

                /**
                 * Whether to load the data for the component when the component is connected
                 */
                autoLoad: {
                    attribute: 'auto-load',
                    type: DataTypes.Boolean,
                    value: true
                },

                /**
                 * The metadata key to get the metadata from the header of the response
                 */
                metadataKey: {
                    attribute: 'metadata-key',
                    type: DataTypes.String
                }
            };
        }

        static get state(): Record<string, CustomElementStateMetadata> {

            return {

                /**
                 * Flag to know whether it is loading
                 */
                loading: {
                    value: false
                },

                /**
                 * The metadata of the loaded component
                 */
                metadata: {}
            };
        }

        renderLoading() {

            if (this.loading === false) {

                return null;
            }

            return html`
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

            if (this.autoLoad === true) { // Wait until all the fields were added

                setTimeout(() => this.loadRemote(undefined), 0); // Wait for the next refresh to load
            }
        }

        loadRemote(params: DynamicObject | undefined) {

            this.loading = true;

            this._loadFetcher?.fetch({
                url: this.loadUrl,
                params
            });
        }

        async handleLoadData(data: DataResponse) {

            await this.updateComplete;

            this.loading = false;

            if (this.metadataKey !== undefined) {

                const header = data.headers.get(this.metadataKey) as string;

                this.metadata = JSON.parse(header);
            }

            this.handleLoadedData(data);
        }

        handleLoadedData(data: DataResponse) {
    
            this[this.dataField] = data.payload || data;
        }

        async handleLoadError(error: ErrorResponse) {

            await this.updateComplete;

            this.loading = false;

            notifyError(this, error);
        }
    }
}