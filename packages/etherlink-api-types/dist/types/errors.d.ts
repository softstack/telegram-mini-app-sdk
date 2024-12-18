import { EtherlinkErrorType } from './types';
export declare class EtherlinkError extends Error {
    constructor(errorType: Exclude<EtherlinkErrorType, 'generic'>, message?: string);
    readonly errorType: Exclude<EtherlinkErrorType, 'generic'>;
}
export declare const isEtherlinkError: (error: unknown) => error is EtherlinkError;
