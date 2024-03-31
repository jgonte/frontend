function getAppLinks() {

    const layoutGroup = {
        text: 'Layout'
    };

    const navigationGroup = {
        text: 'Navigation'
    };

    const editorsGroup = {
        text: 'Editors'
    };

    const displayGroup = {
        text: 'Display'
    };

    const toolsGroup = {
        text: 'Tools'
    };

    const fieldsGroup = {
        text: 'Fields'
    };

    const tipsGroup = {
        text: 'Tips'
    };

    //const authGroup = {
    //    text: 'Auth'
    //};

    return {
        '/': {
            text: 'Intro'
        },
        '/localized-text': {
            text: 'Localized Text'
        },
        '/icon': {
            text: 'Icon'
        },
        '/pill': {
            text: 'Pill'
        },
        '/alert': {
            text: 'Alert'
        },
        '/button': {
            text: 'Button'
        },
        '/dialog': {
            text: 'Dialog'
        },
        '/drop-down': {
            text: 'Drop Down'
        },
        '/tool-tip': {
            text: 'Tool Tip'
        },
        '/validation-summary': {
            text: 'Validation Summary'
        },
        '/wizard': {
            text: 'Wizard'
        },
        // Layout
        '/layout/center': {
            group: layoutGroup,
            text: 'Center'
        },
        '/layout/panel': {
            group: layoutGroup,
            text: 'Panel'
        },
        '/layout/accordion': {
            group: layoutGroup,
            text: 'Accordion'
        },

        // Navigation
        '/navigation/link': {
            group: navigationGroup,
            text: 'Link'
        },

        // Editors
        '/editors/cell': {
            group: editorsGroup,
            text: 'Cell Editor'
        },

        // Display
        '/display/data-template': {
            group: displayGroup,
            text: 'Data Template'
        },
        '/display/data-list': {
            group: displayGroup,
            text: 'Data List'
        },
        '/display/data-header-cell': {
            group: displayGroup,
            text: 'Data Header Cell'
        },
        '/display/data-grid': {
            group: displayGroup,
            text: 'Data Grid'
        },
        '/display/collection-panel': {
            group: displayGroup,
            text: 'Collection Panel'
        },
        '/display/property-grid': {
            group: displayGroup,
            text: 'Property Grid'
        },

        // Tools
        '/tools/close': {
            group: toolsGroup,
            text: 'Close'
        },
        '/tools/expander': {
            group: toolsGroup,
            text: 'Expander'
        },
        '/tools/sorter': {
            group: toolsGroup,
            text: 'Sorter'
        },
        // Fields
        '/fields/combo-box': {
            group: fieldsGroup,
            text: 'Combo Box'
        },
        '/fields/slider': {
            group: fieldsGroup,
            text: 'Slider'
        },
        '/fields/switch': {
            group: fieldsGroup,
            text: 'Switch'
        },
        '/fields/text-field': {
            group: fieldsGroup,
            text: 'Text Field'
        },
        '/fields/star-rating': {
            group: fieldsGroup,
            text: 'Star Rating'
        },
        // Form
        '/form-field': {
            text: 'Form Field'
        },
        '/form': {
            text: 'Form'
        },
        // Tips
        '/tips/help': {
            group: tipsGroup,
            text: 'Help'
        },
        '/tips/modified': {
            group: tipsGroup,
            text: 'Modified'
        },
        '/tips/required': {
            group: tipsGroup,
            text: 'Required'
        }
    };
}