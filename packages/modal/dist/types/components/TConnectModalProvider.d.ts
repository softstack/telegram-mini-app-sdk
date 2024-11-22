import { ReactNode } from 'react';
import { TConnectModalContextValue } from '../types';
export declare const TConnectModalContext: import("react").Context<TConnectModalContextValue>;
export interface TConnectModalProviderProps {
    appName: string;
    appUrl: string;
    bridgeUrl: string;
    apiKey: string;
    networkFilter?: Array<'etherlink' | 'tezos'>;
    genericWalletUrl?: string;
    children?: ReactNode | undefined;
    onError?: (error: unknown) => void;
}
export declare const TConnectModalProvider: import("react").NamedExoticComponent<TConnectModalProviderProps>;
export declare const useTConnectModal: () => TConnectModalContextValue;
