export class ProviderRpcError extends Error {
    constructor(message, code, data) {
        super(message);
        this.code = code;
        this.data = data;
    }
}
//# sourceMappingURL=ProviderRpcError.js.map