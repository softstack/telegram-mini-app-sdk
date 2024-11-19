import { TezosWcErrorType } from './types';
export declare class TezosWcError extends Error {
    constructor(errorType: Exclude<TezosWcErrorType, 'generic'>, message?: string);
    readonly errorType: Exclude<TezosWcErrorType, 'generic'>;
}
export declare const isTezosWcError: (error: unknown) => error is TezosWcError;
