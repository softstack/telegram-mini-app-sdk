"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEvmError = exports.EvmError = void 0;
class EvmError extends Error {
    constructor(errorType, message) {
        super(message);
        this.errorType = errorType;
    }
}
exports.EvmError = EvmError;
const isEvmError = (error) => error instanceof EvmError;
exports.isEvmError = isEvmError;
//# sourceMappingURL=errors.js.map