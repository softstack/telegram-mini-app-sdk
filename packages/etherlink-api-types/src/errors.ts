import { EtherlinkErrorType } from './types';

/**
 * Represents an error specific to the Etherlink bridge context.
 * Extends the standard `Error` class to include an `errorType` property.
 *
 * @class
 * @extends {Error}
 *
 * @param {Exclude<EtherlinkErrorType, 'generic'>} errorType - The specific type of Etherlink error, excluding 'generic'.
 * @param {string} [message] - An optional error message providing more details about the error.
 *
 * @property {Exclude<EtherlinkErrorType, 'generic'>} errorType - The specific type of Etherlink error.
 */
export class EtherlinkError extends Error {
	/**
	 * Constructs an instance of the error with a specific type and optional message.
	 *
	 * @param errorType - The type of the error, excluding the 'generic' type.
	 * @param message - An optional message providing additional details about the error.
	 */
	constructor(errorType: Exclude<EtherlinkErrorType, 'generic'>, message?: string) {
		super(message);
		this.errorType = errorType;
	}

	/**
	 * Represents the type of Etherlink error, excluding the 'generic' type.
	 *
	 * @readonly
	 * @type {Exclude<EtherlinkErrorType, 'generic'>}
	 */
	readonly errorType: Exclude<EtherlinkErrorType, 'generic'>;
}

/**
 * Checks if the given error is an instance of EtherlinkError.
 *
 * @param error - The error to check.
 * @returns True if the error is an instance of EtherlinkError, false otherwise.
 */
export const isEtherlinkError = (error: unknown): error is EtherlinkError => error instanceof EtherlinkError;
