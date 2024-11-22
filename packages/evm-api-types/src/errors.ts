import { EvmErrorType } from './types';

/**
 * Represents an error specific to the EVM (Ethereum Virtual Machine) bridge context.
 * Extends the standard `Error` class to include an `errorType` property.
 *
 * @class
 * @extends {Error}
 *
 * @param {Exclude<EvmErrorType, 'generic'>} errorType - The specific type of EVM error, excluding 'generic'.
 * @param {string} [message] - An optional error message providing more details about the error.
 *
 * @property {Exclude<EvmErrorType, 'generic'>} errorType - The specific type of EVM error.
 */
export class EvmError extends Error {
	/**
	 * Constructs an instance of the error with a specific type and optional message.
	 *
	 * @param errorType - The type of the error, excluding the 'generic' type.
	 * @param message - An optional message providing additional details about the error.
	 */
	constructor(errorType: Exclude<EvmErrorType, 'generic'>, message?: string) {
		super(message);
		this.errorType = errorType;
	}

	/**
	 * Represents the type of EVM error, excluding the 'generic' type.
	 *
	 * @readonly
	 * @type {Exclude<EvmErrorType, 'generic'>}
	 */
	readonly errorType: Exclude<EvmErrorType, 'generic'>;
}

/**
 * Checks if the given error is an instance of EvmError.
 *
 * @param error - The error to check.
 * @returns True if the error is an instance of EvmError, false otherwise.
 */
export const isEvmError = (error: unknown): error is EvmError => error instanceof EvmError;
