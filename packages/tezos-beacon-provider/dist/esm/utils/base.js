export const toBigint = (value) => {
    try {
        return BigInt(value);
    }
    catch {
        return undefined;
    }
};
export const toIntegerString = (value) => BigInt(value).toString();
export const formatTransactionAmount = (amount, mutez = false) => {
    if (mutez) {
        return BigInt(amount).toString();
    }
    return (BigInt(amount) * 10n ** 6n).toString();
};
//# sourceMappingURL=base.js.map