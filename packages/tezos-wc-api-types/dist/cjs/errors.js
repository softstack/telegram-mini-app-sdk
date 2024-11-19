"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTezosWcError = exports.TezosWcError = void 0;
class TezosWcError extends Error {
    constructor(errorType, message) {
        super(message);
        this.errorType = errorType;
    }
}
exports.TezosWcError = TezosWcError;
const isTezosWcError = (error) => error instanceof TezosWcError;
exports.isTezosWcError = isTezosWcError;
//# sourceMappingURL=errors.js.map