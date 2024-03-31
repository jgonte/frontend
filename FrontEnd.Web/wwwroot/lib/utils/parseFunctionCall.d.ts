export default function parseFunctionCall(callString: string): {
    functionName: string;
    parameters: unknown[];
} | null;
