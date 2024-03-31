window.appConfig = {

    logo: './images/gcs-logo.svg',

    title: 'GCS Design System',

    useThemeSelector: true,

    defaultTheme: '180-light',

    apiUrl: 'https://localhost:5000/api',

    iconsPath: 'https://localhost:7000/demo/icons/',

    // auth: {
    //     authority: "https://localhost:5000",
    //     client_id: "wclib-demo",
    //     redirect_uri: "https://localhost:5501/oidc-callback.html",
    //     response_type: "id_token token",
    //     scope: "openid profile email wclib-demo.user",
    //     post_logout_redirect_uri: "https://localhost:5501/"
    // },
    
    intl: {
        data: {
            'en': {
                'fullName': 'Full Name',
                'fullNameHelp': 'This is the full name',
                'thisFieldIsRequired': 'This field is required',
                'thisFieldHasBeenModified': 'This field has been modified',
                '{{label}} is required': '{{label}} is required',
                'Good Morning': 'Good Morning',
                'submit': 'Submit'
            },
            'de': {
                'fullName': 'Vollständiger Name',
                'fullNameHelp': 'Dies ist der vollständige Name',
                'thisFieldIsRequired': 'Dieses Feld ist erforderlich',
                'thisFieldHasBeenModified': 'Dieses Feld wurde geändert',
                '{{label}} is required': '{{label}} ist erforderlich',
                'Good Morning': 'Guten Morgen',
                'submit': 'Einreichen'
            },
            'fr': {
                'fullName': 'Nom et prénom',
                'fullNameHelp': 'Ceci est le nom complet',
                'thisFieldIsRequired': 'Ce champ est requis',
                'thisFieldHasBeenModified': 'Ce champ a été modifié',
                '{{label}} is required': '{{label}} est requis',
                'Good Morning': 'Bonjour',
                'submit': 'Soumettre'
            },
            'ru': {
                'fullName': 'ФИО',
                'fullNameHelp': 'Это полное имя',
                'thisFieldIsRequired': 'Это поле обязательно к заполнению',
                'thisFieldHasBeenModified': 'Это поле было изменено',
                '{{label}} is required': '{{label}} обязательно к заполнению',
                'Good Morning': 'доброе утро',
                'submit': 'Представлять на рассмотрение'
            },

        }
    }
};