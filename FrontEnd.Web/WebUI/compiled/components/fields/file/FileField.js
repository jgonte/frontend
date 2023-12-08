import defineCustomElement from "../../../custom-element/defineCustomElement";
import html from "../../../rendering/html";
import { DataTypes } from "../../../utils/data/DataTypes";
import DisplayableField from "../DisplayableField";
function formatSize(fileSize) {
    if (fileSize < 1024) {
        return fileSize + 'bytes';
    }
    else if (fileSize >= 1024 && fileSize < 1048576) {
        return (fileSize / 1024).toFixed(1) + 'KB';
    }
    else if (fileSize >= 1048576) {
        return (fileSize / 1048576).toFixed(1) + 'MB';
    }
    throw new Error(`Not implemented for file size: ${fileSize}`);
}
export default class FileField extends DisplayableField {
    static get properties() {
        return {
            accept: {
                type: DataTypes.String
            },
            capture: {
                type: DataTypes.Boolean,
                value: true
            },
            multiple: {
                type: DataTypes.Boolean
            },
            preview: {
                type: DataTypes.Boolean
            }
        };
    }
    render() {
        const { name, accept, capture, multiple, disabled, } = this;
        return html `
<input
    style="opacity: 0; position: absolute;"
    type="file"
    name=${name}
    id=${name}
    accept=${accept}
    capture=${capture}
    multiple=${multiple}
    disabled=${disabled}
    onInput=${event => this.handleInput(event)}
    onChange=${event => this.handleChange(event)}
    onBlur=${() => this.handleBlur()}
/>

${this.renderFileList()}

<gcs-button kind="secondary" variant="contained" click=${() => this.openFileDialog()}>
    <gcs-icon name="upload"></gcs-icon>
    <gcs-localized-text>Click here to upload files</gcs-localized-text>
</gcs-button>`;
    }
    openFileDialog() {
        const { name } = this;
        this.document.getElementById(name)?.click();
    }
    renderFileList() {
        const { preview, value, } = this;
        if (preview === false) {
            return null;
        }
        if (value === undefined) {
            return null;
        }
        const data = Array.isArray(value) ? value : [value];
        return data.map(record => {
            const { name, content, size } = record;
            const src = content.indexOf('blob:') === -1 ?
                `data:image/jpeg;base64,${content}` :
                content;
            return html `
<img slot="start" style="width: 48px; height: 48px;" src=${src} />
<span slot="middle">${name}</span>
<span slot="end">${formatSize(size)}</span>`;
        });
    }
}
defineCustomElement('gcs-file-field', FileField);
//# sourceMappingURL=FileField.js.map