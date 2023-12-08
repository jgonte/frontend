export default function getContentWithoutStyle(innerHTML: string | undefined) : string | undefined {

    if (innerHTML === undefined) {

        return innerHTML;
    }

    const index = innerHTML.indexOf('</style>');

    return index > -1 ?
        innerHTML.substring(index + "</style>".length) :
        innerHTML;
}