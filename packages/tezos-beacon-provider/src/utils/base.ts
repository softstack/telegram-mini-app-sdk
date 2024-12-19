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
