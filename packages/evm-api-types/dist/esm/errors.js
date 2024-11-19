export class EvmError extends Error {
    constructor(errorType, message) {
        super(message);
        this.errorType = errorType;
    }
}
export const isEvmError = (error) => error instanceof EvmError;
//# sourceMappingURL=errors.js.map