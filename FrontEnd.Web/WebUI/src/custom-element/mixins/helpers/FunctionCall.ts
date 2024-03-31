export default class FunctionCall {

    private _fcn: (...args: unknown[]) => unknown;

    private _parameters: unknown[];

    constructor(fcn: (...args: unknown[]) => unknown, parameters:  unknown[]) {

        this._fcn = fcn;

        this._parameters = parameters;
    }

    execute() {

        return this._fcn(...this._parameters);
    }
}