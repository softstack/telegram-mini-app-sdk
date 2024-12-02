import { ProviderRpcError } from './ProviderRpcError';

/**
 * Represents the supported EVM wallet applications.
 *
 * @typedef {('bitget' | 'metaMask' | 'rainbow' | 'safePal' | 'trust')} EvmWalletApp
 *
 * @property {'bitget'} bitget - Bitget wallet application.
 * @property {'metaMask'} metaMask - MetaMask wallet application.
 * @property {'rainbow'} rainbow - Rainbow wallet application.
 * @property {'safePal'} safePal - SafePal wallet application.
 * @property {'trust'} trust - Trust wallet application.
 */
export type EvmWalletApp = 'bitget' | 'metaMask' | 'rainbow' | 'safePal' | 'test-wallet' | 'trust';

/**
 * Represents the possible event names for EIP-1193 compliant providers.
 *
 * @typedef {('connect' | 'disconnect' | 'message' | 'chainChanged' | 'accountsChanged')} Eip1193EventName
 *
 * @property {'connect'} connect - Emitted when the provider connects to a network.
 * @property {'disconnect'} disconnect - Emitted when the provider disconnects from a network.
 * @property {'message'} message - Emitted when a message is received from the provider.
 * @property {'chainChanged'} chainChanged - Emitted when the chain ID of the provider changes.
 * @property {'accountsChanged'} accountsChanged - Emitted when the accounts managed by the provider change.
 */
export type Eip1193EventName = 'connect' | 'disconnect' | 'message' | 'chainChanged' | 'accountsChanged';

/**
 * Represents the arguments for a request.
 */
export interface RequestArguments {
	readonly method: string;
	readonly params?: readonly unknown[] | object;
}

/**
 * Represents information about the connection to an Ethereum provider.
 *
 * @property {string} chainId - The unique identifier of the blockchain network.
 */
export interface ProviderConnectInfo {
	readonly chainId: string;
}

/**
 * Represents a message sent by the provider.
 *
 * @interface ProviderMessage
 *
 * @property {string} type - The type of the message.
 * @property {unknown} data - The data associated with the message.
 */
export interface ProviderMessage {
	readonly type: string;
	readonly data: unknown;
}

/**
 * Interface representing the events emitted by an EIP-1193 compliant provider.
 */
export interface EIP1193ProviderEvents {
	/**
	 * Emitted when the provider connects to a network.
	 * @event
	 */
	connect: ProviderConnectInfo;

	/**
	 * Emitted when the provider disconnects from a network.
	 * @event
	 */
	disconnect: ProviderRpcError;

	/**
	 * Emitted when a message is received from the provider.
	 * @event
	 */
	message: ProviderMessage;

	/**
	 * Emitted when the chain ID of the provider changes.
	 * @event
	 */
	chainChanged: string;

	/**
	 * Emitted when the accounts managed by the provider change.
	 * @event
	 */
	accountsChanged: Array<string>;
}

/**
 * Represents an EIP-1193 compliant provider.
 *
 * This interface defines the standard methods and events that an Ethereum provider should implement.
 */
export interface EIP1193Provider {
	/**
	 * Sends a request to the provider.
	 *
	 * @param request - The request object containing the method and parameters.
	 * @returns A promise that resolves with the result of the request.
	 */
	request(request: RequestArguments): Promise<unknown>;

	/**
	 * Registers an event listener for the specified event.
	 *
	 * @param event - The name of the event to listen for.
	 * @param listener - The callback function to handle the event.
	 */
	on(event: 'connect', listener: (connectInfo: ProviderConnectInfo) => void): void;
	on(event: 'disconnect', listener: (error: ProviderRpcError) => void): void;
	on(event: 'message', listener: (message: ProviderMessage) => void): void;
	on(event: 'chainChanged', listener: (chainId: string) => void): void;
	on(event: 'accountsChanged', listener: (accounts: Array<string>) => void): void;

	/**
	 * Removes a previously registered event listener for the specified event.
	 *
	 * @param event - The name of the event.
	 * @param listener - The callback function to remove.
	 */
	removeListener(event: 'connect', listener: (connectInfo: ProviderConnectInfo) => void): void;
	removeListener(event: 'disconnect', listener: (error: ProviderRpcError) => void): void;
	removeListener(event: 'message', listener: (message: ProviderMessage) => void): void;
	removeListener(event: 'chainChanged', listener: (chainId: string) => void): void;
	removeListener(event: 'accountsChanged', listener: (accounts: Array<string>) => void): void;
}

/**
 * Interface representing the events for connecting to an EVM provider.
 * Extends the standard EIP1193 provider events.
 *
 * @extends EIP1193ProviderEvents
 *
 * @property {string} connectionString - The connection string used to connect to the EVM provider.
 */
export interface TConnectEvmProviderEvents extends EIP1193ProviderEvents {
	connectionString: string;
}

/**
 * Options for connecting to an EVM provider.
 *
 * @property {string} bridgeUrl - The URL of the bridge to connect to.
 * @property {string} apiKey - The API key for authentication.
 * @property {EvmWalletApp} [walletApp] - Optional wallet application to use.
 */
export interface TConnectEvmProviderOptions {
	appName: string;
	appUrl: string;
	appIcon?: string;
	bridgeUrl: string;
	apiKey: string;
	walletApp?: EvmWalletApp;
}

/**
 * Represents a serialized TConnect EVM provider.
 */
export interface SerializedTConnectEvmProvider {
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
	 * The URL of the bridge used for communication.
	 */
	bridgeUrl: string;

	/**
	 * The wallet application used for EVM interactions.
	 */
	walletApp: EvmWalletApp | undefined;

	/**
	 * The API key for authentication.
	 */
	_apiKey: string;

	/**
	 * The communication controller identifier.
	 */
	_communicationController: string;

	/**
	 * The session identifier.
	 */
	_sessionId: string;

	/**
	 * The URI for WalletConnect.
	 */
	_connectionString: string;
}
