"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderRpcError = void 0;
class ProviderRpcError extends Error {
    constructor(message, code, data) {
        super(message);
        this.code = code;
        this.data = data;
    }
}
exports.ProviderRpcError = ProviderRpcError;
//# sourceMappingURL=ProviderRpcError.js.map