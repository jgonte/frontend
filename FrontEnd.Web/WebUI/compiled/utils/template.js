export default function template(text, data) {
    const result = {
        keysNotInData: []
    };
    if (!data) {
        result.text = text;
        return result;
    }
    result.keysNotInData = Object.keys(data);
    function processMatch(match) {
        const key = match
            .replace('{{', '')
            .replace('}}', '')
            .trim();
        if (data?.hasOwnProperty(key)) {
            const index = result.keysNotInData.indexOf(key);
            if (index > -1) {
                result.keysNotInData.splice(index, 1);
            }
            return data[key].toString();
        }
        else {
            return match;
        }
    }
    result.text = text.replace(/\{{\S+?\}}/g, processMatch);
    return result;
}
//# sourceMappingURL=template.js.map