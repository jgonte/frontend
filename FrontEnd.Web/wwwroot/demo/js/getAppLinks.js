function getAppLinks() {

    const componentsGroup = {
        iconName: 'code-square',
        text: 'Components',
        collapsed: true
    };

    const layoutGroup = {
        iconName: 'layout-text-sidebar-reverse',
        text: 'Layout',
        collapsed: true
    };

    const navigationGroup = {
        iconName: 'sign-turn-right',
        text: 'Navigation',
        collapsed: true
    };

    const editorsGroup = {
        iconName: 'pencil',
        text: 'Editors',
        collapsed: true
    };

    const displayGroup = {
        iconName: 'display',
        text: 'Display',
        collapsed: true
    };

    const toolsGroup = {
        iconName: 'wrench',
        text: 'Tools',
        collapsed: true
    };

    const fieldsGroup = {
        iconName: 'textarea',
        text: 'Fields',
        collapsed: true
    };

    const tipsGroup = {
        iconName: 'marker-tip',
        text: 'Tips',
        collapsed: true
    };

    //const authGroup = {
    //    text: 'Auth'
    //};

    return {
        '/': {
            text: 'Intro'
        },
        '/localized-text': {
            group: componentsGroup,
            text: 'Localized Text'
        },
        '/icon': {
            group: componentsGroup,
            iconName: 'emoji-wink', 
            text: 'Icon'
        },
        '/pill': {
            group: componentsGroup,
            text: 'Pill'
        },
        '/alert': {
            group: componentsGroup,
            text: 'Alert'
        },
        '/toolbar': {
            group: componentsGroup,
            text: 'Toolbar'
        },
        '/button': {
            group: componentsGroup,
            text: 'Button'
        },
        '/dialog': {
            group: componentsGroup,
            text: 'Dialog'
        },
        '/drop-down': {
            group: componentsGroup,
            text: 'Drop Down'
        },
        '/tool-tip': {
            group: componentsGroup,
            text: 'Tool Tip'
        },
        '/validation-summary': {
            group: componentsGroup,
            text: 'Validation Summary'
        },
        '/wizard': {
            group: componentsGroup,
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
        '/display/tree-view': {
            group: displayGroup,
            text: 'Tree View'
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
            group: fieldsGroup,
            text: 'Form Field'
        },
        '/form': {
            group: componentsGroup,
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