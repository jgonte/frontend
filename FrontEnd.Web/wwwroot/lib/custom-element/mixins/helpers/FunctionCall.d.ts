export default class FunctionCall {
    private _fcn;
    private _parameters;
    constructor(fcn: (...args: unknown[]) => unknown, parameters: unknown[]);
    execute(): unknown;
}
