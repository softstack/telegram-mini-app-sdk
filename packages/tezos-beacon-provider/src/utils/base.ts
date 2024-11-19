export const toBigint = (value: bigint | number | string): bigint | undefined => {
	try {
		return BigInt(value);
	} catch {
		return undefined;
	}
};

export const toIntegerString = (value: bigint | number | string): string => BigInt(value).toString();

export const formatTransactionAmount = (amount: number, mutez = false): string => {
	if (mutez) {
		return BigInt(amount).toString();
	}
	return (BigInt(amount) * 10n ** 6n).toString();
};
