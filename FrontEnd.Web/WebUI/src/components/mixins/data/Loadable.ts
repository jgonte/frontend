import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomElementStateMetadata from "../../../custom-element/mixins/metadata/types/CustomElementStateMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import html from "../../../rendering/html";
import { DataTypes } from "../../../utils/data/DataTypes";
import { ErrorResponse } from "../../../utils/data/transfer/ErrorResponse";
import Fetcher from "../../../utils/data/transfer/Fetcher";
import LoaderData from "../../loader/LoaderData";

export default function LoadableHolder<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class LoadableHolderMixin extends Base {

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

            return html`<gcs-overlay>
                <gcs-alert kind="info" >...Loading</gcs-alert>
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

                setTimeout(() => this.load(), 0); // Wait for the next refresh to load
            }
        }

        load() {

            this.error = undefined; // Clear any previous error

            this.loading = true;

            this._loadFetcher.fetch({
                url: this.loadUrl
            });
        }

        async handleLoadData(data: LoaderData) {

            await this.updateComplete;

            this.loading = false;

            if (this.metadataKey !== undefined) {

                const header = data.headers.get(this.metadataKey) as string;

                this.metadata = JSON.parse(header);
            }

            this.handleLoadedData(data);
        }

        async handleLoadError(error: ErrorResponse) {

            await this.updateComplete;

            this.loading = false;

            this.error = error;

            this.renderError();
        }
    }
}