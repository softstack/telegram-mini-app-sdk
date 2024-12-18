import { Network } from './types';

/**
 * A prefix used for Tailwind CSS classes to ensure uniqueness and avoid conflicts.
 * This prefix is applied to all Tailwind-generated class names within the project.
 */
export const TAILWIND_PREFIX = 'eotrzpirnbqlbfjhbqpo-';

/**
 * A constant key used for storing the Etherlink provider information.
 * This key is used to identify and retrieve the Etherlink provider data
 * from the storage.
 */
export const ETHERLINK_PROVIDER_STORAGE_KEY = 'ksacuemelbykuqyutopv';

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
export const TEZOS_WC_PROVIDER_STORAGE_KEY = 'nxmhhphkvgwzhmifdyus';

/**
 * A constant array of network configurations.
 * Each network configuration includes details about the network type, name, icon, and associated wallets.
 *
 * @constant
 * @type {Array<Network>}
 *
 * @property {string} type - The type of the network (e.g., 'etherlink', 'tezos').
 * @property {string} name - The name of the network.
 * @property {string} icon - The icon identifier for the network.
 * @property {Array<Object>} wallets - An array of wallet configurations associated with the network.
 *
 * @property {string} wallets[].name - The name of the wallet.
 * @property {string} wallets[].icon - The icon identifier for the wallet.
 * @property {string} wallets[].network - The network type the wallet supports.
 * @property {string} [wallets[].walletApp] - The application identifier for the wallet.
 * @property {string} [wallets[].addEtherlinkUrl] - The URL to add the Etherlink (specific to 'etherlink' type wallets).
 * @property {Array<string>} wallets[].supportedOperatingSystems - The operating systems supported by the wallet (e.g., 'android', 'ios').
 * @property {string} [wallets[].bridge] - The bridge type used by the wallet (specific to 'tezos' type wallets).
 */
export const NETWORKS: Array<Network> = [
	{
		type: 'etherlink',
		name: 'Etherlink',
		icon: 'etherlink',
		wallets: [
			{
				name: 'Bitget',
				icon: 'bitget',
				network: 'etherlink',
				walletApp: 'bitget',
				addEtherlinkUrl: '',
				supportedOperatingSystems: ['android', 'ios'],
			},
			{
				name: 'MetaMask',
				icon: 'metaMask',
				network: 'etherlink',
				walletApp: 'metaMask',
				addEtherlinkUrl: '',
				supportedOperatingSystems: ['android', 'ios'],
			},
			{
				name: 'SafePal',
				icon: 'safePal',
				network: 'etherlink',
				walletApp: 'safePal',
				addEtherlinkUrl: '',
				supportedOperatingSystems: ['android', 'ios'],
			},
			{
				name: 'Trust',
				icon: 'trust',
				network: 'etherlink',
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

export const ETHERLINK_MAINNET_DETAILS = [
	{ label: 'Network Name', value: 'Etherlink Mainnet' },
	{ label: 'Chain ID', value: '42793' },
	{ label: 'Symbol', value: 'XTZ' },
	{ label: 'RPC URL', value: 'https://node.mainnet.etherlink.com' },
	{ label: 'Block Explorer URL', value: 'https://explorer.etherlink.com' },
];

export const ETHERLINK_GHOSTNET_DETAILS = [
	{ label: 'Network Name', value: 'Etherlink Testnet' },
	{ label: 'Chain ID', value: '128123' },
	{ label: 'Symbol', value: 'XTZ' },
	{ label: 'RPC URL', value: 'https://node.ghostnet.etherlink.com' },
	{ label: 'Block Explorer URL', value: '	https://testnet.explorer.etherlink.com' },
];

export const TOAST_CONTAINER_ID = 'qbpoorwpbcmnyejvnqad';

export const ADD_ETHERLINK_MAINNET_URL = 'https://add-etherlink-mainnet.tconnect.io';

export const ADD_ETHERLINK_GHOSTNET_URL = 'https://add-etherlink-testnet.tconnect.io';
