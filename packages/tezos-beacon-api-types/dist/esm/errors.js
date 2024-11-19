export class TezosBeaconError extends Error {
    constructor(errorType, message) {
        super(message);
        this.errorType = errorType;
    }
}
export const isTezosBeaconError = (error) => error instanceof TezosBeaconError;
//# sourceMappingURL=errors.js.map