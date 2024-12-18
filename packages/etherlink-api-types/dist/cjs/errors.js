"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEtherlinkError = exports.EtherlinkError = void 0;
class EtherlinkError extends Error {
    constructor(errorType, message) {
        super(message);
        this.errorType = errorType;
    }
}
exports.EtherlinkError = EtherlinkError;
const isEtherlinkError = (error) => error instanceof EtherlinkError;
exports.isEtherlinkError = isEtherlinkError;
//# sourceMappingURL=errors.js.map