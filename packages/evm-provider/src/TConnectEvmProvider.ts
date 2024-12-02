import { parse, sleep, stringify, TypedEvent } from '@tconnect.io/core';
import { CommunicationController } from '@tconnect.io/dapp-communication';
import { getErrorMessage, isAndroid } from '@tconnect.io/dapp-utils';
import {
	EVENT_CHANNEL,
	EvmConnectedRequest,
	EvmConnectedResponse,
	EvmConnectRequest,
	EvmConnectResponse,
	EvmDisconnectRequest,
	EvmDisconnectResponse,
	EvmError,
	EvmEvent,
	EvmReconnectRequest,
	EvmReconnectResponse,
	EvmRequest,
	EvmRequestRequest,
	EvmRequestResponse,
	EvmResponse,
	REQUEST_CHANNEL,
	SOCKET_IO_PATH,
} from '@tconnect.io/evm-api-types';
import WebApp from '@twa-dev/sdk';
import { ProviderRpcError } from './ProviderRpcError';
import {
	EIP1193Provider,
	EvmWalletApp,
	RequestArguments,
	SerializedTConnectEvmProvider,
	TConnectEvmProviderEvents,
	TConnectEvmProviderOptions,
} from './types';
import { getConnectionStringUniversalLink, getUniversalLink } from './utils';
import { validateEvmEvent, validateEvmResponse } from './validation';

/**
 * The TConnectEvmProvider class provides an implementation of the EIP-1193 provider interface
 * for connecting to an EVM-compatible blockchain via a bridge URL and a wallet application.
 * It extends the TypedEvent class to handle various events related to the connection and requests.
 *
 * @extends TypedEvent<TConnectEvmProviderEvents>
 * @implements {EIP1193Provider}
 */
export class TConnectEvmProvider extends TypedEvent<TConnectEvmProviderEvents> implements EIP1193Provider {
	constructor(options: TConnectEvmProviderOptions) {
		super();
		this.appName = options.appName;
		this.appUrl = options.appUrl;
		this.appIcon = options.appIcon;
		this.bridgeUrl = options.bridgeUrl;
		this.walletApp = options?.walletApp;
		this._apiKey = options.apiKey;
		this._communicationController = new CommunicationController(
			this.bridgeUrl,
			SOCKET_IO_PATH,
			REQUEST_CHANNEL,
			EVENT_CHANNEL,
		);
	}

	/**
	 * The name of the application.
	 * This property is read-only and is used to identify the application.
	 */
	readonly appName: string;
	/**
	 * The URL of the application that is using the EVM provider.
	 * This is a read-only property.
	 */
	readonly appUrl: string;
	readonly appIcon: string | undefined;
	/**
	 * The URL of the bridge service that the provider will use to communicate with the EVM network.
	 * This URL is required to establish a connection and perform operations on the EVM network.
	 */
	readonly bridgeUrl: string;
	/**
	 * The wallet application instance for interacting with the EVM (Ethereum Virtual Machine).
	 * This property is read-only and may be undefined if the wallet application is not initialized.
	 */
	readonly walletApp: EvmWalletApp | undefined;

	/**
	 * The API key used for authentication with the EVM provider.
	 *
	 * @private
	 */
	private readonly _apiKey: string;
	/**
	 * A private instance of CommunicationController used to handle communication
	 * between the EVM provider and the external environment. It processes EVM requests,
	 * responses, and events.
	 *
	 * @private
	 */
	private _communicationController: CommunicationController<EvmRequest, EvmResponse, EvmEvent>;
	/**
	 * A unique identifier for the current session.
	 * This identifier is used to track and manage the session state.
	 * It can be undefined if no session is currently active.
	 *
	 * @private
	 */
	private _sessionId: string | undefined;
	/**
	 * The URI used to establish a connection with a WalletConnect session.
	 * This property may be undefined if the URI has not been set.
	 *
	 * @private
	 */
	private _connectionString: string | undefined;

	/**
	 * Establishes a connection with the EVM provider.
	 *
	 * If already connected, it will first disconnect before attempting to reconnect.
	 * Once connected, it sets up an event handler for communication events.
	 *
	 * The method sends a request to establish a connection using the provided API key.
	 * Upon successful connection, it retrieves the session ID and WalletConnect URI.
	 *
	 * If a wallet application is specified, it attempts to open the WalletConnect link.
	 * For Android devices, it sends the link twice with a delay to ensure it opens.
	 *
	 * Finally, it emits the connection string (WalletConnect URI) for further use.
	 *
	 * @returns {Promise<void>} A promise that resolves when the connection process is complete.
	 */
	async connect(): Promise<void> {
		if (this._communicationController.connected()) {
			await this.disconnect();
		}
		await this._communicationController.connect();

		const connectionStringEventHandler = async (event: EvmEvent): Promise<void> => {
			try {
				const validatedEvent = validateEvmEvent(event);
				if (validatedEvent.type === 'connectionString') {
					this._communicationController.off('event', connectionStringEventHandler);
					const { connectionString } = validatedEvent.payload;
					this._connectionString = connectionString;
					if (this.walletApp) {
						// Android needs a second reminder to open the link
						if (isAndroid()) {
							WebApp.openLink(getConnectionStringUniversalLink(this.walletApp, connectionString), {
								try_instant_view: true,
							});
							await sleep(1000);
							WebApp.openLink(getConnectionStringUniversalLink(this.walletApp, connectionString), {
								try_instant_view: true,
							});
						} else {
							WebApp.openLink(getConnectionStringUniversalLink(this.walletApp, connectionString));
						}
					}
					this.emit('connectionString', connectionString);
				}
			} catch (error) {
				console.error(error);
			}
		};

		this._communicationController.on('event', connectionStringEventHandler);
		this._communicationController.on('event', this._createEvmEventHandler());

		const {
			payload: { sessionId },
		} = await this._sendEvmRequest({
			type: 'connect',
			payload: { apiKey: this._apiKey, appName: this.appName, appUrl: this.appUrl, appIcon: this.appIcon },
		});
		this._sessionId = sessionId;
	}

	/**
	 * Checks if the provider is connected.
	 *
	 * This method verifies if there is an active session and if the communication controller is connected.
	 * It then sends a request to check the connection status and returns the result.
	 *
	 * @returns {Promise<boolean>} A promise that resolves to `true` if connected, otherwise `false`.
	 */
	async connected(): Promise<boolean> {
		if (!this._sessionId || !this._communicationController.connected()) {
			return false;
		}
		const response = await this._sendEvmRequest({
			type: 'connected',
			sessionId: this._getSessionId(),
		});
		return response.payload.connected;
	}

	/**
	 * Handles Ethereum JSON-RPC requests and sends them to the communication controller.
	 * If the wallet application is set and is not 'bitget', it opens a universal link for certain methods.
	 *
	 * @param {RequestArguments} args - The arguments for the JSON-RPC request.
	 * @returns {Promise<unknown>} A promise that resolves with the response payload.
	 *
	 * @remarks
	 * The method handles the following Ethereum JSON-RPC methods by opening a universal link:
	 * - 'eth_sendTransaction'
	 * - 'eth_sign'
	 * - 'eth_signTransaction'
	 * - 'eth_signTypedData'
	 * - 'eth_signTypedData_v3'
	 * - 'eth_signTypedData_v4'
	 * - 'personal_sign'
	 */
	async request(args: RequestArguments): Promise<unknown> {
		if (this.walletApp && this.walletApp !== 'bitget') {
			switch (args.method) {
				case 'eth_sendTransaction':
				case 'eth_sign':
				case 'eth_signTransaction':
				case 'eth_signTypedData':
				case 'eth_signTypedData_v3':
				case 'eth_signTypedData_v4':
				case 'personal_sign': {
					WebApp.openLink(getUniversalLink(this.walletApp));
					break;
				}
			}
		}
		const response = (await this._communicationController.send({
			type: 'request',
			sessionId: this._getSessionId(),
			payload: args,
		})) as EvmRequestResponse;
		return response.payload;
	}

	/**
	 * Disconnects the provider from the current session.
	 *
	 * This method sends a 'disconnect' message to the communication controller
	 * and emits a 'disconnect' event with a `ProviderRpcError` indicating the
	 * disconnection. It also ensures that the communication controller is
	 * properly disconnected.
	 *
	 * @returns {Promise<void>} A promise that resolves when the disconnection process is complete.
	 */
	async disconnect(): Promise<void> {
		try {
			await this._communicationController.send({ type: 'disconnect', sessionId: this._getSessionId() });
		} finally {
			this.emit('disconnect', new ProviderRpcError('Disconnected', 4900));
			this._communicationController.disconnect();
		}
	}

	/**
	 * Serializes the TConnectEvmProvider instance into a JSON string.
	 *
	 * @returns {string} A JSON string representation of the TConnectEvmProvider instance.
	 */
	serialize(): string {
		return stringify({
			appName: this.appName,
			appUrl: this.appUrl,
			appIcon: this.appIcon,
			bridgeUrl: this.bridgeUrl,
			walletApp: this.walletApp,
			_apiKey: this._apiKey,
			_communicationController: this._communicationController.serialize(),
			_sessionId: this._getSessionId(),
			_connectionString: this._getConnectionString(),
		} satisfies SerializedTConnectEvmProvider);
	}

	/**
	 * Deserializes a JSON string into a `TConnectEvmProvider` instance.
	 *
	 * @param json - The JSON string to deserialize.
	 * @returns A promise that resolves to a `TConnectEvmProvider` instance.
	 */
	static async deserialize(json: string): Promise<TConnectEvmProvider> {
		const data = parse(json) as SerializedTConnectEvmProvider;
		const provider = new TConnectEvmProvider({
			appName: data.appName,
			appUrl: data.appUrl,
			appIcon: data.appIcon,
			bridgeUrl: data.bridgeUrl,
			apiKey: data._apiKey,
			walletApp: data.walletApp,
		});
		provider._communicationController = CommunicationController.deserialize(data._communicationController);
		provider._sessionId = data._sessionId;
		provider._connectionString = data._connectionString;
		await provider._reconnect();
		return provider;
	}

	/**
	 * Reconnects the EVM provider by setting up the event handler and sending a reconnect request.
	 *
	 * This method performs the following steps:
	 * 1. Registers an event handler for communication events.
	 * 2. Establishes a connection with the communication controller.
	 * 3. Sends a reconnect request with the current session ID.
	 *
	 * @returns {Promise<void>} A promise that resolves when the reconnection process is complete.
	 * @private
	 */
	private async _reconnect(): Promise<void> {
		this._communicationController.on('event', this._createEvmEventHandler());
		await this._communicationController.connect();
		await this._sendEvmRequest({ type: 'reconnect', sessionId: this._getSessionId() });
	}

	/**
	 * Creates an event handler for EVM events.
	 *
	 * This handler validates incoming EVM events and emits corresponding events
	 * based on the event type. The supported event types are:
	 * - 'connect': Emitted when a connection is established.
	 * - 'message': Emitted when a message is received.
	 * - 'chainChanged': Emitted when the blockchain chain is changed.
	 * - 'accountsChanged': Emitted when the accounts are changed.
	 * - 'disconnect': Emitted when a disconnection occurs, with an error message, code, and data.
	 *
	 * If an error occurs during event validation or handling, it is logged to the console.
	 *
	 * @returns {Function} A function that handles EVM events.
	 * @private
	 */
	private _createEvmEventHandler() {
		return (event: EvmEvent): void => {
			try {
				const validatedEvent = validateEvmEvent(event);
				switch (validatedEvent.type) {
					case 'connect': {
						this.emit('connect', validatedEvent.payload);
						break;
					}
					case 'message': {
						this.emit('message', validatedEvent.payload);
						break;
					}
					case 'chainChanged': {
						this.emit('chainChanged', validatedEvent.payload);
						break;
					}
					case 'accountsChanged': {
						this.emit('accountsChanged', validatedEvent.payload);
						break;
					}
					case 'disconnect': {
						const { message, code, data } = validatedEvent.payload;
						this.emit('disconnect', new ProviderRpcError(message, code, data));
						break;
					}
				}
			} catch (error) {
				console.error(error);
			}
		};
	}

	/**
	 * Sends an EVM request and returns the response after validation.
	 *
	 * @param evmRequest - The EVM request to be sent.
	 * @returns A promise that resolves to the EVM response.
	 * @throws Will throw an error if there is no connection, if the response contains an error, or if the response type does not match the request type.
	 * @private
	 */
	private async _sendEvmRequest(evmRequest: EvmConnectRequest): Promise<EvmConnectResponse>;
	private async _sendEvmRequest(evmRequest: EvmConnectedRequest): Promise<EvmConnectedResponse>;
	private async _sendEvmRequest(evmRequest: EvmRequestRequest): Promise<EvmRequestResponse>;
	private async _sendEvmRequest(evmRequest: EvmReconnectRequest): Promise<EvmReconnectResponse>;
	private async _sendEvmRequest(evmRequest: EvmDisconnectRequest): Promise<EvmDisconnectResponse>;
	private async _sendEvmRequest(evmRequest: EvmRequest): Promise<EvmResponse> {
		if (!this._communicationController.connected()) {
			throw new Error("Can't send request without connection");
		}
		const evmResponse = await this._communicationController.send(evmRequest);
		const validatedEvmResponse = validateEvmResponse(evmResponse);
		if (validatedEvmResponse.type === 'error') {
			if (validatedEvmResponse.payload.type === 'generic') {
				let errorMessage = `Error Code: ${validatedEvmResponse.payload.key}`;
				if (validatedEvmResponse.payload.message) {
					errorMessage += `: ${validatedEvmResponse.payload.message}`;
				}
				throw new Error(errorMessage);
			} else {
				throw new EvmError(
					validatedEvmResponse.payload.type,
					getErrorMessage(validatedEvmResponse.payload.type, validatedEvmResponse.payload.message),
				);
			}
		}
		if (evmRequest.type !== validatedEvmResponse.type) {
			throw new Error('Response type is different from request type');
		}
		return evmResponse;
	}

	/**
	 * Retrieves the current session ID.
	 *
	 * @returns {string} The session ID.
	 * @throws {Error} If the session ID is not set.
	 * @private
	 */
	private _getSessionId(): string {
		if (!this._sessionId) {
			throw new Error('Session ID is not set');
		}
		return this._sessionId;
	}

	/**
	 * Retrieves the WalletConnect URI.
	 *
	 * @returns {string} The WalletConnect URI.
	 * @throws {Error} If the WalletConnect URI is not set.
	 * @private
	 */
	private _getConnectionString(): string {
		if (!this._connectionString) {
			throw new Error('Connection string is not set');
		}
		return this._connectionString;
	}
}
