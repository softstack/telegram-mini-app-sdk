import { TypedEvent } from '@tconnect.io/core';
import { EtherlinkNetwork } from '@tconnect.io/etherlink-api-types';
import { EIP1193Provider, EtherlinkWalletApp, RequestArguments, TConnectEtherlinkProviderEvents, TConnectEtherlinkProviderOptions } from './types';
export declare class TConnectEtherlinkProvider extends TypedEvent<TConnectEtherlinkProviderEvents> implements EIP1193Provider {
    constructor(options: TConnectEtherlinkProviderOptions);
    readonly appName: string;
    readonly appUrl: string;
    readonly appIcon: string | undefined;
    readonly bridgeUrl: string;
    readonly walletApp: EtherlinkWalletApp | undefined;
    readonly network: EtherlinkNetwork;
    private readonly _apiKey;
    private _communicationController;
    private _sessionId;
    private _connectionString;
    connect(): Promise<void>;
    connected(): Promise<boolean>;
    request(args: RequestArguments): Promise<unknown>;
    disconnect(): Promise<void>;
    serialize(): string;
    static deserialize(json: string): Promise<TConnectEtherlinkProvider>;
    private _reconnect;
    private _createEtherlinkEventHandler;
    private _sendEtherlinkRequest;
    private _getSessionId;
    private _getConnectionString;
}
