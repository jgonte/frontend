import { DynamicObject } from "./types";

export interface TemplateResult {
    /**
     * The text resulting from replacing the placeholders that match the name of the data members
     * with the value of those data members
     */
    text?: string;

    /**
     * The array with the name of the data members whose names did not match the ones in the placeholders
     */
    keysNotInData: string[];
}

/**
 * Replaces any placeholders "{{name}}" with the value of the data property that matches that name
 * @param text
 * @param data
 */
export default function template(text: string, data?: DynamicObject): TemplateResult {

    const result: TemplateResult = {
        keysNotInData: []
    };

    if (!data) {

        result.text = text;

        return result; // Nothing to replace in the template, return the original text
    }

    result.keysNotInData = Object.keys(data); // Assume there hasn't been a match so far

    function processMatch(match: string /*, offset: number, str: string*/) {

        const key = match
            .replace('{{', '')
            .replace('}}', '')
            .trim(); // Remove the {{ }} around the match

        if (data?.hasOwnProperty(key)) {

            // Remove the "non matched" data member key
            const index: number = result.keysNotInData.indexOf(key);

            if (index > -1) {
                // Not removed already

                result.keysNotInData.splice(index, 1);
            }

            return (data[key] as object).toString();
        }
        else {

            return match;
        }
    }

    result.text = text.replace(/\{{\S+?\}}/g, processMatch);

    return result;
}