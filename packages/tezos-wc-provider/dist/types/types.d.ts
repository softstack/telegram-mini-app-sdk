import { TezosWcNetwork } from '@tconnect.io/tezos-wc-api-types';
export type TezosWcWalletApp = 'kukai';
export type SigningType = 'raw' | 'operation' | 'micheline';
export interface TConnectTezosWcProviderOptions {
    appName: string;
    appUrl: string;
    appIcon?: string;
    apiKey: string;
    network: TezosWcNetwork;
    bridgeUrl: string;
    walletApp?: TezosWcWalletApp;
}
export interface SerializedTConnectTezosWcProvider {
    appName: string;
    appUrl: string;
    appIcon: string | undefined;
    walletApp: TezosWcWalletApp | undefined;
    network: TezosWcNetwork;
    bridgeUrl: string;
    _apiKey: string;
    _communicationController: string;
    _sessionId: string;
    _connectionString: string;
}
export interface TConnectTezosWcProviderEvents {
    connectionString: string;
    disconnect: undefined;
}
export type GetAccountsResult = [
    {
        address: string;
        pubkey: string;
        algo: string;
    }
];
export interface SignResult {
    signature: string;
}
export interface SendResult {
    operationHash: string;
}
export interface RequestSignPayloadInput {
    signingType?: SigningType;
    payload: string;
    sourceAddress?: string;
}
