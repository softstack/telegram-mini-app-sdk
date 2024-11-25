import { TypedEvent } from '@tconnect.io/core';
import { EIP1193Provider, EvmWalletApp, RequestArguments, TConnectEvmProviderEvents, TConnectEvmProviderOptions } from './types';
export declare class TConnectEvmProvider extends TypedEvent<TConnectEvmProviderEvents> implements EIP1193Provider {
    constructor(options: TConnectEvmProviderOptions);
    readonly appName: string;
    readonly appUrl: string;
    readonly appIcon: string | undefined;
    readonly bridgeUrl: string;
    readonly walletApp: EvmWalletApp | undefined;
    private readonly _apiKey;
    private _communicationController;
    private _sessionId;
    private _walletConnectUri;
    connect(): Promise<void>;
    connected(): Promise<boolean>;
    request(args: RequestArguments): Promise<unknown>;
    disconnect(): Promise<void>;
    serialize(): string;
    static deserialize(json: string): Promise<TConnectEvmProvider>;
    private _reconnect;
    private _createEvmEventHandler;
    private _sendEvmRequest;
    private _getSessionId;
    private _getWalletConnectUri;
}
