import { TezosBeaconErrorType } from './types';

export class TezosBeaconError extends Error {
	constructor(errorType: Exclude<TezosBeaconErrorType, 'generic'>, message?: string) {
		super(message);
		this.errorType = errorType;
	}

	readonly errorType: Exclude<TezosBeaconErrorType, 'generic'>;
}

export const isTezosBeaconError = (error: unknown): error is TezosBeaconError => error instanceof TezosBeaconError;
