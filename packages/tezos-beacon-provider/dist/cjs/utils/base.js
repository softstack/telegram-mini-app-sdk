"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTransactionAmount = exports.toIntegerString = exports.toBigint = void 0;
const toBigint = (value) => {
    try {
        return BigInt(value);
    }
    catch {
        return undefined;
    }
};
exports.toBigint = toBigint;
const toIntegerString = (value) => BigInt(value).toString();
exports.toIntegerString = toIntegerString;
const formatTransactionAmount = (amount, mutez = false) => {
    if (mutez) {
        return BigInt(amount).toString();
    }
    return (BigInt(amount) * 10n ** 6n).toString();
};
exports.formatTransactionAmount = formatTransactionAmount;
//# sourceMappingURL=base.js.map