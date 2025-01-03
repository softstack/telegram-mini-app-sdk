import { OperatingSystem } from '@tconnect.io/dapp-utils';
import { EtherlinkWalletApp, TConnectEtherlinkProvider } from '@tconnect.io/etherlink-provider';
import { TConnectTezosBeaconProvider, TezosBeaconWalletApp } from '@tconnect.io/tezos-beacon-provider';
import { TConnectTezosWcProvider, TezosWcWalletApp } from '@tconnect.io/tezos-wc-provider';
export type PngIconType = 'airGap' | 'altme' | 'bitget' | 'etherlink' | 'kukai' | 'metaMask' | 'safePal' | 'temple' | 'tezos' | 'transparent' | 'trust';
export type SvgIconType = 'checkSolid' | 'chevronDownSolid' | 'chevronLeftSolid' | 'chevronUpSolid' | 'copyRegular' | 'fileLinesRegular' | 'xmarkSolid';
export type IconType = PngIconType | SvgIconType;
export interface EtherlinkNetwork {
    type: 'etherlink';
    name: string;
    icon: IconType;
    wallets: Array<{
        name: string;
        icon: IconType;
        network: 'etherlink';
        bridge: 'etherlink';
        walletApp: EtherlinkWalletApp;
        supportedOperatingSystems: Array<OperatingSystem>;
    }>;
}
export interface TezosBeaconWallet {
    name: string;
    icon: IconType;
    network: 'tezos';
    bridge: 'beacon';
    walletApp: TezosBeaconWalletApp;
    supportedOperatingSystems: Array<OperatingSystem>;
}
export interface TezosWcWallet {
    name: string;
    icon: IconType;
    network: 'tezos';
    bridge: 'wc';
    walletApp: TezosWcWalletApp;
    supportedOperatingSystems: Array<OperatingSystem>;
}
export interface TezosNetwork {
    type: 'tezos';
    name: string;
    icon: IconType;
    wallets: Array<TezosBeaconWallet | TezosWcWallet>;
}
export type Network = EtherlinkNetwork | TezosNetwork;
export type NetworkType = Network['type'];
export interface TConnectModalContextValue {
    openModal: () => void;
    closeModal: () => void;
    etherlinkProvider: TConnectEtherlinkProvider | undefined;
    tezosBeaconProvider: TConnectTezosBeaconProvider | undefined;
    tezosWcProvider: TConnectTezosWcProvider | undefined;
    connected: boolean;
}
