"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBigint = void 0;
const toBigint = (value) => {
    try {
        return BigInt(value);
    }
    catch {
        return undefined;
    }
};
exports.toBigint = toBigint;
//# sourceMappingURL=base.js.map