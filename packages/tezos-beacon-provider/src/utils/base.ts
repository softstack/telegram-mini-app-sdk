/**
 * Converts a given value to a bigint.
 *
 * @param value - The value to convert. It can be of type bigint, number, or string.
 * @returns The converted bigint value, or undefined if the conversion fails.
 */
export const toBigint = (value: bigint | number | string): bigint | undefined => {
	try {
		return BigInt(value);
	} catch {
		return undefined;
	}
};

/**
 * Converts a given value to its integer string representation.
 *
 * @param value - The value to be converted, which can be of type bigint, number, or string.
 * @returns The integer string representation of the given value.
 */
export const toIntegerString = (value: bigint | number | string): string => BigInt(value).toString();

/**
 * Formats a transaction amount.
 *
 * @param amount - The amount to format.
 * @param mutez - A boolean indicating whether the amount is in mutez (smallest unit of Tezos).
 *                If true, the amount is returned as is. If false, the amount is converted to mutez.
 * @returns The formatted transaction amount as a string.
 */
export const formatTransactionAmount = (amount: number, mutez = false): string => {
	if (mutez) {
		return BigInt(amount).toString();
	}
	return (BigInt(amount) * 10n ** 6n).toString();
};
