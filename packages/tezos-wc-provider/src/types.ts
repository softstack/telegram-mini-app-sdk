import { TezosWcNetwork } from '@tconnect.io/tezos-wc-api-types';

/**
 * Represents the supported Tezos Wallet Connect applications.
 *
 * Currently, the only supported application is 'kukai'.
 */
export type TezosWcWalletApp = 'kukai';

export type SigningType = 'raw' | 'operation' | 'micheline';

/**
 * Options for connecting a Tezos WalletConnect provider.
 */
export interface TConnectTezosWcProviderOptions {
	/**
	 * The name of the application.
	 */
	appName: string;

	/**
	 * The URL of the application.
	 */
	appUrl: string;

	appIcon?: string;

	/**
	 * The API key used for authentication.
	 */
	apiKey: string;

	/**
	 * The network to connect to (e.g., mainnet, testnet).
	 */
	network: TezosWcNetwork;

	/**
	 * The URL of the WalletConnect bridge server.
	 */
	bridgeUrl: string;

	/**
	 * Optional: The wallet application to use for WalletConnect.
	 */
	walletApp?: TezosWcWalletApp;
}

/**
 * Represents a serialized Tezos WalletConnect provider.
 */
export interface SerializedTConnectTezosWcProvider {
	/**
	 * The name of the application.
	 */
	appName: string;

	/**
	 * The URL of the application.
	 */
	appUrl: string;

	appIcon: string | undefined;

	/**
	 * The wallet application used for Tezos WalletConnect.
	 */
	walletApp: TezosWcWalletApp | undefined;

	/**
	 * The network configuration for the Tezos blockchain.
	 */
	network: TezosWcNetwork;

	/**
	 * The URL of the bridge server used for WalletConnect communication.
	 */
	bridgeUrl: string;

	/**
	 * The API key used for authentication.
	 */
	_apiKey: string;

	/**
	 * The communication controller identifier.
	 */
	_communicationController: string;

	/**
	 * The session identifier for the WalletConnect session.
	 */
	_sessionId: string;

	/**
	 * The URI for the WalletConnect connection.
	 */
	_connectionString: string;
}

/**
 * Interface representing the events for connecting to the Tezos WalletConnect provider.
 */
export interface TConnectTezosWcProviderEvents {
	connectionString: string;
	disconnect: undefined;
}

export type GetAccountsResult = [
	{
		address: string;
		pubkey: string;
		algo: string; // 'ed25519'
	},
];

export interface SignResult {
	signature: string;
}

export interface SendResult {
	operationHash: string;
}

export interface RequestSignPayloadInput {
	signingType?: SigningType;
	payload: string;
	sourceAddress?: string;
}
