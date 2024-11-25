import { OperatingSystem } from '@tconnect.io/dapp-utils';
import { EvmWalletApp, TConnectEvmProvider } from '@tconnect.io/evm-provider';
import { TConnectTezosBeaconProvider, TezosBeaconWalletApp } from '@tconnect.io/tezos-beacon-provider';
import { TConnectTezosWcProvider, TezosWcWalletApp } from '@tconnect.io/tezos-wc-provider';

export type PngIconType =
	| 'airGap'
	| 'altme'
	| 'bitget'
	| 'etherlink'
	| 'kukai'
	| 'metaMask'
	| 'rainbow'
	| 'safePal'
	| 'temple'
	| 'tezos'
	| 'transparent'
	| 'trust';

export type SvgIconType =
	| 'checkSolid'
	| 'chevronDownSolid'
	| 'chevronUpSolid'
	| 'copyRegular'
	| 'fileLinesRegular'
	| 'xmarkSolid';

export type IconType = PngIconType | SvgIconType;

export interface EvmNetwork {
	type: 'evm';
	name: string;
	icon: IconType;
	wallets: Array<{
		name: string;
		icon: IconType;
		network: 'evm';
		walletApp: EvmWalletApp;
		addEtherlinkUrl: string;
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

export type Network = EvmNetwork | TezosNetwork;

export type NetworkType = Network['type'];

export interface TConnectModalContextValue {
	openModal: () => void;
	closeModal: () => void;
	evmProvider: TConnectEvmProvider | undefined;
	tezosBeaconProvider: TConnectTezosBeaconProvider | undefined;
	tezosWcProvider: TConnectTezosWcProvider | undefined;
	connected: boolean;
}
