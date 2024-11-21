import { Network, TezosBeaconWallet } from './types';

export const TAILWIND_PREFIX = 'eotrzpirnbqlbfjhbqpo-';

export const EVM_PROVIDER_STORAGE_KEY = 'jdqmbvrjralxgetjnyao';

export const TEZOS_BEACON_PROVIDER_STORAGE_KEY = 'jkdkvddgajorkvmywwub';

export const TEZOS_WC_PROVIDER_STORAGE_KEY = 'szyzljncagbqzpuimevq';

export const NETWORKS: Array<Network> = [
	{
		type: 'evm',
		name: 'Etherlink',
		icon: 'etherlink',
		wallets: [
			{
				name: 'Bitget',
				icon: 'bitget',
				network: 'evm',
				walletApp: 'bitget',
				addEtherlinkUrl: '',
				supportedOperatingSystems: ['android', 'ios'],
			},
			{
				name: 'MetaMask',
				icon: 'metaMask',
				network: 'evm',
				walletApp: 'metaMask',
				addEtherlinkUrl: '',
				supportedOperatingSystems: ['android', 'ios'],
			},
			{
				name: 'Rainbow',
				icon: 'rainbow',
				network: 'evm',
				walletApp: 'rainbow',
				addEtherlinkUrl: '',
				supportedOperatingSystems: ['android', 'ios'],
			},
			{
				name: 'SafePal',
				icon: 'safePal',
				network: 'evm',
				walletApp: 'safePal',
				addEtherlinkUrl: '',
				supportedOperatingSystems: ['android', 'ios'],
			},
			{
				name: 'Trust',
				icon: 'trust',
				network: 'evm',
				walletApp: 'trust',
				addEtherlinkUrl: '',
				supportedOperatingSystems: ['android', 'ios'],
			},
		],
	},
	{
		type: 'tezos',
		name: 'Tezos',
		icon: 'tezos',
		wallets: [
			{
				name: 'Altme',
				icon: 'altme',
				network: 'tezos',
				bridge: 'beacon',
				walletApp: 'altme',
				supportedOperatingSystems: ['android', 'ios'],
			},
			{
				name: 'Kukai',
				icon: 'kukai',
				network: 'tezos',
				bridge: 'wc',
				walletApp: 'kukai',
				supportedOperatingSystems: ['ios'],
			},
			{
				name: 'Temple',
				icon: 'temple',
				network: 'tezos',
				bridge: 'beacon',
				walletApp: 'temple',
				supportedOperatingSystems: ['android', 'ios'],
			},
		],
	},
];

export const EXPERIMENTAL_WALLET: TezosBeaconWallet = {
	name: 'Experimental Wallet',
	icon: 'transparent',
	network: 'tezos',
	bridge: 'beacon',
	walletApp: '_generic_',
	supportedOperatingSystems: ['android', 'ios'],
};
