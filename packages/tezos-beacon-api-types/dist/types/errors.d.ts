import { TezosBeaconErrorType } from './types';
export declare class TezosBeaconError extends Error {
    constructor(errorType: Exclude<TezosBeaconErrorType, 'generic'>, message?: string);
    readonly errorType: Exclude<TezosBeaconErrorType, 'generic'>;
}
export declare const isTezosBeaconError: (error: unknown) => error is TezosBeaconError;
