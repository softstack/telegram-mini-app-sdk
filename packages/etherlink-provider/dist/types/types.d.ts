import { EtherlinkNetwork } from '@tconnect.io/etherlink-api-types';
import { ProviderRpcError } from './ProviderRpcError';
export type EtherlinkWalletApp = 'bitget' | 'metaMask' | 'safePal' | 'trust';
export type Eip1193EventName = 'connect' | 'disconnect' | 'message' | 'chainChanged' | 'accountsChanged';
export interface RequestArguments {
    readonly method: string;
    readonly params?: readonly unknown[] | object;
}
export interface ProviderConnectInfo {
    readonly chainId: string;
}
export interface ProviderMessage {
    readonly type: string;
    readonly data: unknown;
}
export interface EIP1193ProviderEvents {
    connect: ProviderConnectInfo;
    disconnect: ProviderRpcError;
    message: ProviderMessage;
    chainChanged: string;
    accountsChanged: Array<string>;
}
export interface EIP1193Provider {
    request(request: RequestArguments): Promise<unknown>;
    on(event: 'connect', listener: (connectInfo: ProviderConnectInfo) => void): void;
    on(event: 'disconnect', listener: (error: ProviderRpcError) => void): void;
    on(event: 'message', listener: (message: ProviderMessage) => void): void;
    on(event: 'chainChanged', listener: (chainId: string) => void): void;
    on(event: 'accountsChanged', listener: (accounts: Array<string>) => void): void;
    removeListener(event: 'connect', listener: (connectInfo: ProviderConnectInfo) => void): void;
    removeListener(event: 'disconnect', listener: (error: ProviderRpcError) => void): void;
    removeListener(event: 'message', listener: (message: ProviderMessage) => void): void;
    removeListener(event: 'chainChanged', listener: (chainId: string) => void): void;
    removeListener(event: 'accountsChanged', listener: (accounts: Array<string>) => void): void;
}
export interface TConnectEtherlinkProviderEvents extends EIP1193ProviderEvents {
    connectionString: string;
}
export interface TConnectEtherlinkProviderOptions {
    appName: string;
    appUrl: string;
    appIcon?: string;
    bridgeUrl: string;
    apiKey: string;
    network: EtherlinkNetwork;
    walletApp?: EtherlinkWalletApp;
}
export interface SerializedTConnectEtherlinkProvider {
    appName: string;
    appUrl: string;
    appIcon: string | undefined;
    bridgeUrl: string;
    walletApp: EtherlinkWalletApp | undefined;
    network: EtherlinkNetwork;
    _apiKey: string;
    _communicationController: string;
    _sessionId: string;
    _connectionString: string;
}
