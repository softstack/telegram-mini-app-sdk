export class EtherlinkError extends Error {
    constructor(errorType, message) {
        super(message);
        this.errorType = errorType;
    }
}
export const isEtherlinkError = (error) => error instanceof EtherlinkError;
//# sourceMappingURL=errors.js.map