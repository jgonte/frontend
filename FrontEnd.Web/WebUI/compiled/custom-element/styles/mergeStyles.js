export default function mergeStyles(style1, style2) {
    if (style1 === undefined) {
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
//# sourceMappingURL=mergeStyles.js.map