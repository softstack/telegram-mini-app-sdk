export type TezosWcErrorType = 'generic' | 'invalidSessionId' | 'invalidApiKey' | 'walletRequestFailed';
export type TezosWcNetwork = 'mainnet' | 'ghostnet';
export interface TezosWcConnectRequest {
    type: 'connect';
    payload: {
        apiKey: string;
        network: TezosWcNetwork;
        appName: string;
        appUrl: string;
        appIcon: string | undefined;
    };
}
export interface TezosWcConnectResponse {
    type: 'connect';
    payload: {
        sessionId: string;
    };
}
export interface TezosWcConnectedRequest {
    type: 'connected';
    sessionId: string;
}
export interface TezosWcConnectedResponse {
    type: 'connected';
    payload: {
        connected: boolean;
    };
}
export interface TezosWcRequestRequest {
    type: 'request';
    sessionId: string;
    payload: {
        method: 'tezos_getAccounts';
        params: Record<string, never>;
    } | {
        method: 'tezos_send';
        params: {
            account: string;
            opertions: Array<{
                kind: 'transaction';
                amount: string;
                destination: string;
            }>;
        };
    } | {
        method: 'tezos_sign';
        params: {
            account: string;
            payload: string;
        };
    };
}
export interface TezosWcRequestResponse {
    type: 'request';
    payload: unknown;
}
export interface TezosWcReconnectRequest {
    type: 'reconnect';
    sessionId: string;
}
export interface TezosWcReconnectResponse {
    type: 'reconnect';
}
export interface TezosWcDisconnectRequest {
    type: 'disconnect';
    sessionId: string;
}
export interface TezosWcDisconnectResponse {
    type: 'disconnect';
}
export interface TezosWcErrorResponse {
    type: 'error';
    payload: {
        type: Extract<TezosWcErrorType, 'generic'>;
        key: string;
        message?: string;
    } | {
        type: Exclude<TezosWcErrorType, 'generic'>;
        message: string;
    };
}
export type TezosWcRequest = TezosWcConnectRequest | TezosWcConnectedRequest | TezosWcRequestRequest | TezosWcReconnectRequest | TezosWcDisconnectRequest;
export type TezosWcResponse = TezosWcConnectResponse | TezosWcConnectedResponse | TezosWcRequestResponse | TezosWcReconnectResponse | TezosWcDisconnectResponse;
export interface TezosWcConnectionStringEvent {
    type: 'connectionString';
    payload: {
        connectionString: string;
    };
}
export interface TezosWcDisconnectEvent {
    type: 'disconnect';
}
export type TezosWcEvent = TezosWcConnectionStringEvent | TezosWcDisconnectEvent;
