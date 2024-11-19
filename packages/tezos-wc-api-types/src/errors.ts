import { TezosWcErrorType } from './types';

export class TezosWcError extends Error {
	constructor(errorType: Exclude<TezosWcErrorType, 'generic'>, message?: string) {
		super(message);
		this.errorType = errorType;
	}

	readonly errorType: Exclude<TezosWcErrorType, 'generic'>;
}

export const isTezosWcError = (error: unknown): error is TezosWcError => error instanceof TezosWcError;
