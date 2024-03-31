import parseValue from "./parseValue";

export default function parseFunctionCall(callString: string): { functionName: string, parameters: unknown[] } | null {

    const regex = /(\w+)\((.*)\)/;

    const match = callString.match(regex);

    if (match && match.length === 3) {

        const functionName = match[1];

        const parametersString = match[2].trim();

        const parameters = parametersString.length > 0 ? parametersString.split(',').map(param => parseValue(param.trim())) : [];
        
        return { functionName, parameters };
    }

    return null;
}

