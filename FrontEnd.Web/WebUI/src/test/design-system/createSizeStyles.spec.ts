import Button from "../../components/button/Button";
import createSizeStyles from "../../design-system/createSizeStyles";

describe("createSizeStyles tests", () => {

    it('should output the styles for a button of primary kind', () => {

        const styles = createSizeStyles(Button);

        expect(styles).toEqual("\n:host {\n    min-height: var(--gcs-min-height);\n}\n\n:host {\n    margin: var(--gcs-margin);\n}\n\n:host([size='large']) {\n    font-size: var(--gcs-font-size-large);\n}\n\n:host([size='medium']) {\n    font-size: var(--gcs-font-size-medium);\n}\n\n:host([size='small']) {\n    font-size: var(--gcs-font-size-small);\n}");
    });
});