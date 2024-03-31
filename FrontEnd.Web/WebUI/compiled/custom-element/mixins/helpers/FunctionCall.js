export default class FunctionCall {
    _fcn;
    _parameters;
    constructor(fcn, parameters) {
        this._fcn = fcn;
        this._parameters = parameters;
    }
    execute() {
        return this._fcn(...this._parameters);
    }
}
//# sourceMappingURL=FunctionCall.js.map