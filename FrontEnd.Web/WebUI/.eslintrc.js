module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2022
    },
    extends: [
        "plugin:@typescript-eslint/recommended"
    ],
    rules: {
        "@typescript-eslint/no-inferrable-types": "off"
    },
    env: {
        browser: true,
        node: true,
        jest: true
    }
};