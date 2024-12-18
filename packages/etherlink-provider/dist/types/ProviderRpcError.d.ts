export declare class ProviderRpcError extends Error {
    constructor(message: string, code: number, data?: unknown);
    readonly code: number;
    readonly data?: unknown;
}
