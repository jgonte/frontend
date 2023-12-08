/**
 * Merges two styles in a formatted way
 * @param style1 
 * @param style2 
 * @returns 
 */
export default function mergeStyles(style1: string | undefined, style2: string): string {

    if (style1 === undefined) { // If the base component does not have styles defined

        return `
${style2}
    `.trim();
    }
    else {

        return `
${style1}

${style2}
    `.trim();
    }
}