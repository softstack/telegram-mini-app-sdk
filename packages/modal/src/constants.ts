import { Network, TezosBeaconWallet } from './types';

/**
 * A prefix used for Tailwind CSS classes to ensure uniqueness and avoid conflicts.
 * This prefix is applied to all Tailwind-generated class names within the project.
 */
export const TAILWIND_PREFIX = 'eotrzpirnbqlbfjhbqpo-';

/**
 * A constant key used for storing the EVM provider information.
 * This key is used to identify and retrieve the EVM provider data
 * from the storage.
 */
export const EVM_PROVIDER_STORAGE_KEY = 'mfiqmlieehlcobqzqiav';

/**
 * A constant string key used for storing the Tezos Beacon provider information.
 * This key is utilized to save and retrieve data related to the Tezos Beacon provider
 * from the storage mechanism in the application.
 */
export const TEZOS_BEACON_PROVIDER_STORAGE_KEY = 'jkdkvddgajorkvmywwub';

/**
 * A constant string key used for storing the Tezos WalletConnect provider information.
 * This key is used to identify and retrieve the provider data from storage.
 */
export const TEZOS_WC_PROVIDER_STORAGE_KEY = 'oergkxuqjljvgrkkzeth';

/**
 * A constant array of network configurations.
 * Each network configuration includes details about the network type, name, icon, and associated wallets.
 *
 * @constant
 * @type {Array<Network>}
 *
 * @property {string} type - The type of the network (e.g., 'evm', 'tezos').
 * @property {string} name - The name of the network.
 * @property {string} icon - The icon identifier for the network.
 * @property {Array<Object>} wallets - An array of wallet configurations associated with the network.
 *
 * @property {string} wallets[].name - The name of the wallet.
 * @property {string} wallets[].icon - The icon identifier for the wallet.
 * @property {string} wallets[].network - The network type the wallet supports.
 * @property {string} [wallets[].walletApp] - The application identifier for the wallet.
 * @property {string} [wallets[].addEtherlinkUrl] - The URL to add the Etherlink (specific to 'evm' type wallets).
 * @property {Array<string>} wallets[].supportedOperatingSystems - The operating systems supported by the wallet (e.g., 'android', 'ios').
 * @property {string} [wallets[].bridge] - The bridge type used by the wallet (specific to 'tezos' type wallets).
 */
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

/**
 * An experimental wallet configuration for Tezos Beacon.
 *
 * @constant
 * @type {TezosBeaconWallet}
 * @property {string} name - The name of the wallet.
 * @property {string} icon - The icon type of the wallet.
 * @property {string} network - The network the wallet is connected to.
 * @property {string} bridge - The bridge protocol used by the wallet.
 * @property {string} walletApp - The generic wallet application identifier.
 * @property {string[]} supportedOperatingSystems - The list of supported operating systems.
 */
export const EXPERIMENTAL_WALLET: TezosBeaconWallet = {
	name: 'Experimental Wallet',
	icon: 'transparent',
	network: 'tezos',
	bridge: 'beacon',
	walletApp: '_generic_',
	supportedOperatingSystems: ['android', 'ios'],
};
