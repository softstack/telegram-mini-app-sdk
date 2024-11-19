"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTezosBeaconError = exports.TezosBeaconError = void 0;
class TezosBeaconError extends Error {
    constructor(errorType, message) {
        super(message);
        this.errorType = errorType;
    }
}
exports.TezosBeaconError = TezosBeaconError;
const isTezosBeaconError = (error) => error instanceof TezosBeaconError;
exports.isTezosBeaconError = isTezosBeaconError;
//# sourceMappingURL=errors.js.map