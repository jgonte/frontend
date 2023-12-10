function getAppRoutes() {

    const views = "/demo/views";

    return {
        '/': {
            view: `${views}/intro.html`
        },
        '/localized-text': {
            view: `${views}/localized-text.html`
        },
        '/icon': {
            view: `${views}/icon.html`
        },
        '/pill': {
            view: `${views}/pill.html`
        },
        '/alert': {
            view: `${views}/alert.html`
        },
        '/button': {
            view: `${views}/button.html`
        },
        '/dialog': {
            view: `${views}/dialog.html`
        },
        '/loader': {
            view: `${views}/loader.html`
        },
        '/drop-down': {
            view: `${views}/drop-down.html`
        },
        '/tool-tip': {
            view: `${views}/tool-tip.html`
        },
        '/validation-summary': {
            view: `${views}/validation-summary.html`
        },
        '/wizard': {
            view: `${views}/wizard.html`
        },
        // Layout
        '/layout/center': {
            view: `${views}/layout/center.html`
        },
        '/layout/panel': {
            view: `${views}/layout/panel.html`
        },
        '/layout/accordion': {
            view: 
            `${views}/layout/accordion.html`
        },

        // Navigation
        '/navigation/link': {
            view: `${views}/navigation/link.html`
        },

        // Display
        '/display/data-template': {
            view: `${views}/display/data-template.html`
        },
        '/display/data-list': {
            view: `${views}/display/data-list.html`
        },
        '/display/data-header-cell': {
            view: `${views}/display/data-header-cell.html`
        },
        '/display/data-grid': {
            view: `${views}/display/data-grid.html`
        },
        '/display/collection-panel': {
            view: `${views}/display/collection-panel.html`
        },

        // Tools
        '/tools/close': {
            view: `${views}/tools/close.html`
        },
        '/tools/expander': {
            view: `${views}/tools/expander.html`
        },
        '/tools/sorter': {
            view: `${views}/tools/sorter.html`
        },
        
        // Fields
        '/fields/combo-box': {
            view: `${views}/fields/combo-box.html`
        },
        '/fields/slider': {
            view: `${views}/fields/slider.html`
        },
        '/fields/switch': {
            view: `${views}/fields/switch.html`
        },
        '/fields/text-field': {
            view: `${views}/fields/text-field.html`
        },
        '/fields/star-rating': {
            view: `${views}/fields/star-rating.html`
        },

        // Form
        '/form-field': {
            view: `${views}/form-field.html`
        },
        '/form': {
            view: `${views}/form.html`
        },

        // Tips
        '/tips/help': {
            view: `${views}/tips/help.html`
        },
        '/tips/modified': {
            view: `${views}/tips/modified.html`
        },
        '/tips/required': {
            view: `${views}/tips/required.html`
        }
    };
}