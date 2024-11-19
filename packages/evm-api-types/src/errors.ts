import { EvmErrorType } from './types';

export class EvmError extends Error {
	constructor(errorType: Exclude<EvmErrorType, 'generic'>, message?: string) {
		super(message);
		this.errorType = errorType;
	}

	readonly errorType: Exclude<EvmErrorType, 'generic'>;
}

export const isEvmError = (error: unknown): error is EvmError => error instanceof EvmError;
