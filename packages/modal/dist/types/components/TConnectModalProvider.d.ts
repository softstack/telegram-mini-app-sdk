import { EtherlinkNetwork as EtherlinkNetworkType } from '@tconnect.io/etherlink-api-types';
import { Network as TezosBeaconNetwork } from '@tconnect.io/tezos-beacon-provider';
import { TezosWcNetwork } from '@tconnect.io/tezos-wc-api-types';
import { ReactNode } from 'react';
import { TConnectModalContextValue } from '../types';
export declare const TConnectModalContext: import("react").Context<TConnectModalContextValue>;
export interface TConnectModalProviderProps {
    appName: string;
    appUrl: string;
    appIcon?: string;
    bridgeUrl: string;
    apiKey: string;
    networkFilter?: Array<'etherlink' | 'tezos'>;
    etherlinkNetwork?: EtherlinkNetworkType;
    tezosBeaconNetwork?: TezosBeaconNetwork;
    tezosWcNetwork?: TezosWcNetwork;
    children?: ReactNode | undefined;
}
export declare const TConnectModalProvider: import("react").NamedExoticComponent<TConnectModalProviderProps>;
export declare const useTConnectModal: () => TConnectModalContextValue;
