import { TezosWcErrorType } from './types';

/**
 * Represents an error specific to the Tezos WalletConnect API.
 *
 * @class TezosWcError
 * @extends {Error}
 *
 * @param {Exclude<TezosWcErrorType, 'generic'>} errorType - The type of the error, excluding the 'generic' type.
 * @param {string} [message] - Optional error message providing more details about the error.
 *
 * @property {Exclude<TezosWcErrorType, 'generic'>} errorType - The type of the error.
 */
export class TezosWcError extends Error {
	/**
	 * Constructs a new instance of the error with a specific type and optional message.
	 *
	 * @param errorType - The type of the error, excluding the 'generic' type.
	 * @param message - An optional message providing more details about the error.
	 */
	constructor(errorType: Exclude<TezosWcErrorType, 'generic'>, message?: string) {
		super(message);
		this.errorType = errorType;
	}

	/**
	 * Represents the specific type of Tezos WalletConnect error, excluding the generic error type.
	 *
	 * @type {Exclude<TezosWcErrorType, 'generic'>}
	 */
	readonly errorType: Exclude<TezosWcErrorType, 'generic'>;
}

/**
 * Type guard function to check if an error is an instance of `TezosWcError`.
 *
 * @param error - The error to check.
 * @returns A boolean indicating whether the error is an instance of `TezosWcError`.
 */
export const isTezosWcError = (error: unknown): error is TezosWcError => error instanceof TezosWcError;
