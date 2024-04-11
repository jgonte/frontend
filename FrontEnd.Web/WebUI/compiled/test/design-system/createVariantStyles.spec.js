import Button from "../../components/button/Button";
import createVariantStyles from "../../design-system/createVariantStyles";
describe("createVariantStyles tests", () => {
    it('should output the styles for a button of primary kind', () => {
        const styles = createVariantStyles(Button, 'primary');
        expect(styles).toEqual("\n:host([kind='primary'][variant='outlined']) button:not(disabled) { \n    color: var(--gcs-color-primary); \n    background-color: var(--gcs-bg-color-primary); \n    border-color: var(--gcs-color-primary); \n}\n\n:host([kind='primary'][variant='outlined']) button:disabled { \n    color: var(--gcs-disabled-color); \n    background-color: var(--gcs-disabled-bg-color); \n    border-color: var(--gcs-disabled-color); \n}\n\n:host([kind='primary'][variant='text']) button:not(disabled) { \n    color: var(--gcs-color-primary);\n}\n\n:host([kind='primary'][variant='text']) button:disabled { \n    color: var(--gcs-disabled-color);\n}\n\n:host([kind='primary'][variant='contained']) button:not(disabled) { \n    color: var(--gcs-color-contained-primary); \n    background-color: var(--gcs-bg-color-contained-primary); \n}\n\n:host([kind='primary'][variant='contained']) button:disabled { \n    color: var(--gcs-disabled-bg-color); \n    background-color: var(--gcs-disabled-color); \n}");
    });
});
//# sourceMappingURL=createVariantStyles.spec.js.map