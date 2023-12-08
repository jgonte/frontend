import { GenericRecord } from "./types";

const cache = {};

export const resourceLoader = {

    /**
     * Gets the resource
     * @param path The path to the resource
     */
    async get(path: string): Promise<string> {

        let content = (cache as GenericRecord)[path] as string;

        if (content !== undefined) {

            return content;
        }

        const response = await fetch(path);

        // Right now we are only interested in the text response

        content = await response.text();

        (cache as GenericRecord)[path] = content;

        return content;
    }
};