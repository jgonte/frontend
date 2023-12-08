function getAppLinks() {

    const layoutGroup = {
        text: 'Layout',
        intlKey: 'layout'
    };

    const navigationGroup = {
        text: 'Navigation',
        intlKey: 'navigation'
    };

    const displayGroup = {
        text: 'Display',
        intlKey: 'display'
    };

    const toolsGroup = {
        text: 'Tools',
        intlKey: 'tools'
    };

    const fieldsGroup = {
        text: 'Fields',
        intlKey: 'fields'
    };

    const tipsGroup = {
        text: 'Tips',
        intlKey: 'tips'
    };

    const authGroup = {
        text: 'Auth',
        intlKey: 'auth'
    };

    return {
        '/': {
            text: 'Intro',
            intlKey: 'intro'
        },
        '/localized-text': {
            text: 'Localized Text',
            intlKey: 'localized text'
        },
        '/icon': {
            text: 'Icon',
            intlKey: 'icon'
        },
        '/pill': {
            text: 'Pill',
            intlKey: 'pill'
        },
        '/alert': {
            text: 'Alert',
            intlKey: 'alert'
        },
        '/button': {
            text: 'Button',
            intlKey: 'button'
        },
        '/dialog': {
            text: 'Dialog',
            intlKey: 'dialog'
        },
        '/loader': {
            text: 'Loader',
            intlKey: 'loader'
        },
        '/drop-down': {
            text: 'Drop Down',
            intlKey: 'drop down'
        },
        '/tool-tip': {
            text: 'Tool Tip',
            intlKey: 'tool tip'
        },
        '/validation-summary': {
            text: 'Validation Summary',
            intlKey: 'validation summary'
        },
        '/wizard': {
            text: 'Wizard',
            intlKey: 'wizard'
        },
        // Layout
        '/layout/center': {
            group: layoutGroup,
            text: 'Center',
            intlKey: 'center'
        },
        '/layout/panel': {
            group: layoutGroup,
            text: 'Panel',
            intlKey: 'panel'
        },
        '/layout/accordion': {
            group: layoutGroup,
            text: 'Accordion',
            intlKey: 'accordion'
        },
        // Navigation
        '/navigation/link': {
            group: navigationGroup,
            text: 'Link',
            intlKey: 'link'
        },
        // Display
        '/display/data-template': {
            group: displayGroup,
            text: 'Data Template',
            intlKey: 'data template'
        },
        '/display/data-list': {
            group: displayGroup,
            text: 'Data List',
            intlKey: 'data list'
        },
        '/display/data-header-cell': {
            group: displayGroup,
            text: 'Data Header Cell',
            intlKey: 'data header cell'
        },
        '/display/data-grid': {
            group: displayGroup,
            text: 'Data Grid',
            intlKey: 'data grid'
        },
        // Tools
        '/tools/close': {
            group: toolsGroup,
            text: 'Close',
            intlKey: 'close'
        },
        '/tools/expander': {
            group: toolsGroup,
            text: 'Expander',
            intlKey: 'expander'
        },
        '/tools/sorter': {
            group: toolsGroup,
            text: 'Sorter',
            intlKey: 'sorter'
        },
        // Fields
        '/fields/combo-box': {
            group: fieldsGroup,
            text: 'Combo Box',
            intlKey: 'combo Box'
        },
        '/fields/slider': {
            group: fieldsGroup,
            text: 'Slider',
            intlKey: 'slider'
        },
        '/fields/switch': {
            group: fieldsGroup,
            text: 'Switch',
            intlKey: 'switch'
        },
        '/fields/text-field': {
            group: fieldsGroup,
            text: 'Text Field',
            intlKey: 'text field'
        },
        '/fields/star-rating': {
            group: fieldsGroup,
            text: 'Star Rating',
            intlKey: 'star rating'
        },
        // Form
        '/form-field': {
            text: 'Form Field',
            intlKey: 'form field'
        },
        '/form': {
            text: 'Form ',
            intlKey: 'form '
        },
        // Tips
        '/tips/help': {
            group: tipsGroup,
            text: 'Help',
            intlKey: 'help'
        },
        '/tips/modified': {
            group: tipsGroup,
            text: 'Modified',
            intlKey: 'modified'
        },
        '/tips/required': {
            group: tipsGroup,
            text: 'Required',
            intlKey: 'required'
        }
    };
}