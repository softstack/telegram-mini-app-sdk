export class TezosWcError extends Error {
    constructor(errorType, message) {
        super(message);
        this.errorType = errorType;
    }
}
export const isTezosWcError = (error) => error instanceof TezosWcError;
//# sourceMappingURL=errors.js.map