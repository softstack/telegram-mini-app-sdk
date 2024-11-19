export type TezosWcErrorType = 'generic' | 'invalidSessionId' | 'invalidApiKey' | 'walletRequestFailed';
export type TezosWcNetwork = 'mainnet' | 'ghostnet';
export interface TezosWcConnectRequest {
    type: 'connect';
    payload: {
        apiKey: string;
        network: TezosWcNetwork;
    };
}
export interface TezosWcConnectResponse {
    type: 'connect';
    payload: {
        sessionId: string;
        walletConnectUri: string;
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
    payload: unknown;
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
        message?: string;
    };
}
export type TezosWcRequest = TezosWcConnectRequest | TezosWcConnectedRequest | TezosWcRequestRequest | TezosWcReconnectRequest | TezosWcDisconnectRequest;
export type TezosWcResponse = TezosWcConnectResponse | TezosWcConnectedResponse | TezosWcRequestResponse | TezosWcReconnectResponse | TezosWcDisconnectResponse;
export interface TezosWcConnectEvent {
    type: 'connect';
    payload: {
        sessionId: string;
    };
}
export interface TezosWcDisconnectEvent {
    type: 'disconnect';
}
export type TezosWcEvent = TezosWcConnectEvent | TezosWcDisconnectEvent;
