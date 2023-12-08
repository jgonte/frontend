export default function getContentWithoutStyle(innerHTML) {
    if (innerHTML === undefined) {
        return innerHTML;
    }
    const index = innerHTML.indexOf('</style>');
    return index > -1 ?
        innerHTML.substring(index + "</style>".length) :
        innerHTML;
}
//# sourceMappingURL=getContentWithoutStyle.js.map