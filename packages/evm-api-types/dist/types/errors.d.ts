import { EvmErrorType } from './types';
export declare class EvmError extends Error {
    constructor(errorType: Exclude<EvmErrorType, 'generic'>, message?: string);
    readonly errorType: Exclude<EvmErrorType, 'generic'>;
}
export declare const isEvmError: (error: unknown) => error is EvmError;
