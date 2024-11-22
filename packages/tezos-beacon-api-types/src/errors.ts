import { TezosBeaconErrorType } from './types';

/**
 * Represents an error specific to the Tezos Beacon Bridge API.
 *
 * @extends {Error}
 *
 * @param {Exclude<TezosBeaconErrorType, 'generic'>} errorType - The type of the error, excluding the 'generic' type.
 * @param {string} [message] - An optional message providing more details about the error.
 *
 * @property {Exclude<TezosBeaconErrorType, 'generic'>} errorType - The type of the error.
 */
export class TezosBeaconError extends Error {
	/**
	 * Constructs a new instance of the error with the specified type and optional message.
	 *
	 * @param errorType - The type of the Tezos Beacon error, excluding the 'generic' type.
	 * @param message - An optional message providing additional details about the error.
	 */
	constructor(errorType: Exclude<TezosBeaconErrorType, 'generic'>, message?: string) {
		super(message);
		this.errorType = errorType;
	}

	/**
	 * Represents the type of error encountered, excluding the generic error type.
	 *
	 * @readonly
	 * @type {Exclude<TezosBeaconErrorType, 'generic'>}
	 */
	readonly errorType: Exclude<TezosBeaconErrorType, 'generic'>;
}

/**
 * Type guard function to check if an error is an instance of `TezosBeaconError`.
 *
 * @param error - The error to check.
 * @returns A boolean indicating whether the error is an instance of `TezosBeaconError`.
 */
export const isTezosBeaconError = (error: unknown): error is TezosBeaconError => error instanceof TezosBeaconError;
