/**
 * Represents an error that occurs during an RPC call in the provider.
 * Extends the built-in `Error` class to include additional properties.
 */
export class ProviderRpcError extends Error {
	/**
	 * Creates an instance of `ProviderRpcError`.
	 * @param message - A descriptive error message.
	 * @param code - A numeric code representing the error type.
	 * @param data - Optional additional data related to the error.
	 */
	constructor(message: string, code: number, data?: unknown) {
		super(message);
		this.code = code;
		this.data = data;
	}

	/**
	 * A numeric code representing the error type.
	 */
	readonly code: number;

	/**
	 * Optional additional data related to the error.
	 */
	readonly data?: unknown;
}
