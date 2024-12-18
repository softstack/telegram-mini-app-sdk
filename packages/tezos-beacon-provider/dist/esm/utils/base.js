export const toBigint = (value) => {
    try {
        return BigInt(value);
    }
    catch {
        return undefined;
    }
};
//# sourceMappingURL=base.js.map