import {
	WalletDelegateParams,
	WalletFinalizeUnstakeParams,
	WalletIncreasePaidStorageParams,
	WalletOriginateParams,
	WalletProvider,
	WalletStakeParams,
	WalletTransferParams,
	WalletTransferTicketParams,
	WalletUnstakeParams,
} from '@taquito/taquito';
import { parse, sleep, stringify, TypedEvent } from '@tconnect.io/core';
import { CommunicationController } from '@tconnect.io/dapp-communication';
import { getErrorMessage, isAndroid, openLink } from '@tconnect.io/dapp-utils';
import {
	EVENT_CHANNEL,
	REQUEST_CHANNEL,
	SOCKET_IO_PATH,
	TezosWcConnectedRequest,
	TezosWcConnectedResponse,
	TezosWcConnectRequest,
	TezosWcConnectResponse,
	TezosWcDisconnectRequest,
	TezosWcDisconnectResponse,
	TezosWcError,
	TezosWcEvent,
	TezosWcNetwork,
	TezosWcReconnectRequest,
	TezosWcReconnectResponse,
	TezosWcRequest,
	TezosWcRequestRequest,
	TezosWcRequestResponse,
	TezosWcResponse,
} from '@tconnect.io/tezos-wc-api-types';
import {
	GetAccountsResult,
	RequestSignPayloadInput,
	SerializedTConnectTezosWcProvider,
	TConnectTezosWcProviderEvents,
	TConnectTezosWcProviderOptions,
	TezosWcWalletApp,
} from './types';
import { getConnectionStringUniversalLink, getUniversalLink } from './utils/utils';
import {
	isGetAccountsResult,
	isSendResult,
	isSignResult,
	validateTezosWcEvent,
	validateTezosWcResponse,
} from './validation';

/**
 * The `TConnectTezosWcProvider` class provides a wallet connection provider for Tezos using WalletConnect.
 * It extends `TypedEvent` to handle events and implements the `WalletProvider` interface.
 *
 * @class
 * @extends TypedEvent<TConnectTezosWcProviderEvents>
 * @implements WalletProvider
 */
export class TConnectTezosWcProvider extends TypedEvent<TConnectTezosWcProviderEvents> implements WalletProvider {
	/**
	 * Creates an instance of TConnectTezosWcProvider.
	 *
	 * @param options - The options for configuring the provider.
	 * @param options.apiKey - The API key for authentication.
	 * @param options.bridgeUrl - The URL of the bridge server.
	 * @param options.walletApp - The wallet application to use.
	 * @param options.network - The network to connect to (default is 'mainnet').
	 */
	constructor(options: TConnectTezosWcProviderOptions) {
		super();
		this.appName = options.appName;
		this.appUrl = options.appUrl;
		this.appIcon = options.appIcon;
		this._apiKey = options.apiKey;
		this.bridgeUrl = options.bridgeUrl;
		this.walletApp = options.walletApp;
		this.network = options.network ?? 'mainnet';
		this._communicationController = new CommunicationController(
			this.bridgeUrl,
			SOCKET_IO_PATH,
			REQUEST_CHANNEL,
			EVENT_CHANNEL,
		);
	}

	/**
	 * The name of the application.
	 * This is a read-only property.
	 */
	readonly appName: string;
	/**
	 * The URL of the application.
	 * This is a read-only property that holds the URL where the application is hosted.
	 */
	readonly appUrl: string;
	readonly appIcon: string | undefined;
	/**
	 * The URL of the bridge server used for communication.
	 * This URL is required to establish a connection between the wallet and the dApp.
	 */
	readonly bridgeUrl: string;
	/**
	 * A readonly property that holds an instance of `TezosWcWalletApp` or `undefined`.
	 * This property represents the wallet application used for Tezos WalletConnect integration.
	 */
	readonly walletApp: TezosWcWalletApp | undefined;
	/**
	 * The network configuration for the Tezos WalletConnect provider.
	 * This property is read-only and specifies the network settings
	 * that the provider will use to interact with the Tezos blockchain.
	 */
	readonly network: TezosWcNetwork;
	private readonly _apiKey: string;
	private _communicationController: CommunicationController<TezosWcRequest, TezosWcResponse, TezosWcEvent>;
	private _sessionId: string | undefined;
	private _connectionString: string | undefined;

	/**
	 * Initiates a permission request to connect to a Tezos wallet using WalletConnect.
	 *
	 * If already connected, it will first disconnect before attempting to connect again.
	 * It sets up an event handler for WalletConnect events and sends a connection request.
	 *
	 * @returns {Promise<void>} A promise that resolves when the permission request is completed.
	 *
	 * @throws {Error} If the connection or permission request fails.
	 *
	 * @remarks
	 * - If the platform is Android, it sends a second reminder to open the WalletConnect link.
	 * - Emits a 'connectionString' event with the WalletConnect URI.
	 */
	async permissionRequest(): Promise<void> {
		if (this._communicationController.connected()) {
			await this.disconnect();
		}
		await this._communicationController.connect();

		const connectionStringEventHandler = async (event: TezosWcEvent): Promise<void> => {
			try {
				const validatedEvent = validateTezosWcEvent(event);
				if (validatedEvent.type === 'connectionString') {
					this._communicationController.off('event', connectionStringEventHandler);
					const { connectionString } = validatedEvent.payload;
					this._connectionString = connectionString;
					if (this.walletApp) {
						// Android needs a second reminder to open the link
						if (isAndroid()) {
							openLink(getConnectionStringUniversalLink(this.walletApp, connectionString), {
								try_instant_view: true,
							});
							await sleep(1000);
							openLink(getConnectionStringUniversalLink(this.walletApp, connectionString), {
								try_instant_view: true,
							});
						} else {
							openLink(getConnectionStringUniversalLink(this.walletApp, connectionString));
						}
					}
					this.emit('connectionString', connectionString);
				}
			} catch (error) {
				console.error(error);
			}
		};

		this._communicationController.on('event', connectionStringEventHandler);

		this._communicationController.on('event', this._createTezosWcEventHandler());

		const {
			payload: { sessionId },
		} = await this._sendTezosWcRequest({
			type: 'connect',
			payload: {
				apiKey: this._apiKey,
				network: this.network,
				appName: this.appName,
				appUrl: this.appUrl,
				appIcon: this.appIcon,
			},
		});
		this._sessionId = sessionId;
	}

	/**
	 * Checks if the provider is connected.
	 *
	 * This method verifies if there is an active session and if the communication
	 * controller is connected. It then sends a request to check the connection status
	 * and returns the result.
	 *
	 * @returns {Promise<boolean>} A promise that resolves to `true` if connected, otherwise `false`.
	 */
	async connected(): Promise<boolean> {
		if (!this._sessionId || !this._communicationController.connected()) {
			return false;
		}
		const response = await this._sendTezosWcRequest({
			type: 'connected',
			sessionId: this._getSessionId(),
		});
		return response.payload.connected;
	}

	/**
	 * Disconnects the current session by sending a disconnect request and performing necessary cleanup.
	 *
	 * @returns {Promise<void>} A promise that resolves when the disconnection process is complete.
	 *
	 * @throws {Error} If there is an issue with sending the disconnect request.
	 *
	 * @emits 'disconnect' - Emitted when the disconnection process is complete.
	 */
	async disconnect(): Promise<void> {
		try {
			await this._sendTezosWcRequest({ type: 'disconnect', sessionId: this._getSessionId() });
		} finally {
			this.emit('disconnect', undefined);
			this._communicationController.disconnect();
		}
	}

	/**
	 * Serializes the current state of the TConnectTezosWcProvider instance into a JSON string.
	 *
	 * @returns {string} A JSON string representing the serialized state of the instance.
	 */
	serialize(): string {
		return stringify({
			appName: this.appName,
			appUrl: this.appUrl,
			appIcon: this.appIcon,
			bridgeUrl: this.bridgeUrl,
			walletApp: this.walletApp,
			network: this.network,
			_apiKey: this._apiKey,
			_communicationController: this._communicationController.serialize(),
			_sessionId: this._getSessionId(),
			_connectionString: this._getConnectionString(),
		} satisfies SerializedTConnectTezosWcProvider);
	}

	/**
	 * Deserializes a JSON string into an instance of TConnectTezosWcProvider.
	 *
	 * @param json - The JSON string to deserialize.
	 * @returns A promise that resolves to an instance of TConnectTezosWcProvider.
	 */
	static async deserialize(json: string): Promise<TConnectTezosWcProvider> {
		const data = parse(json) as SerializedTConnectTezosWcProvider;
		const provider = new TConnectTezosWcProvider({
			appName: data.appName,
			appUrl: data.appUrl,
			appIcon: data.appIcon,
			bridgeUrl: data.bridgeUrl,
			apiKey: data._apiKey,
			walletApp: data.walletApp,
			network: data.network,
		});
		provider._communicationController = CommunicationController.deserialize(data._communicationController);
		provider._sessionId = data._sessionId;
		provider._connectionString = data._connectionString;
		await provider._reconnect();
		return provider;
	}

	/**
	 * Reconnects the Tezos WalletConnect provider.
	 *
	 * This method sets up an event listener for communication events and attempts to reconnect
	 * to the communication controller. It then sends a reconnect request with the current session ID.
	 *
	 * @returns {Promise<void>} A promise that resolves when the reconnection process is complete.
	 * @private
	 */
	private async _reconnect(): Promise<void> {
		this._communicationController.on('event', this._createTezosWcEventHandler());
		await this._communicationController.connect();
		await this._sendTezosWcRequest({ type: 'reconnect', sessionId: this._getSessionId() });
	}

	// Start WalletProvider

	/**
	 * Retrieves the public key hash (PKH) of the connected account.
	 *
	 * @returns {Promise<string>} A promise that resolves to the PKH of the connected account.
	 * @throws {Error} If there is an issue retrieving the accounts.
	 */
	async getPKH(): Promise<string> {
		const accounts = await this._getAccounts();
		return accounts.address;
	}

	/**
	 * Retrieves the public key (PK) of the account.
	 *
	 * @returns {Promise<string>} A promise that resolves to the public key of the account.
	 * @throws {Error} If there is an issue retrieving the accounts.
	 */
	async getPK(): Promise<string> {
		const accounts = await this._getAccounts();
		return accounts.pubkey;
	}

	/**
	 * Maps transfer parameters to wallet parameters.
	 *
	 * This function takes a function that returns a promise of `WalletTransferParams`,
	 * retrieves the transfer parameters, and maps them to the wallet parameters format.
	 *
	 * @param params - A function that returns a promise of `WalletTransferParams`.
	 * @returns A promise that resolves to the wallet parameters.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async mapTransferParamsToWalletParams(params: () => Promise<WalletTransferParams>): Promise<any> {
		const transferParameters = await params();
		console.log('mapTransferParamsToWalletParams()', transferParameters);
		return {
			account: await this.getPKH(),
			operations: [
				{
					kind: 'transaction',
					amount: transferParameters.amount,
					destination: transferParameters.to,
				},
			],
		};
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
	mapTransferTicketParamsToWalletParams(params: () => Promise<WalletTransferTicketParams>): Promise<any> {
		throw new Error('mapTransferTicketParamsToWalletParams not implemented.');
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
	mapStakeParamsToWalletParams(params: () => Promise<WalletStakeParams>): Promise<any> {
		throw new Error('mapStakeParamsToWalletParams not implemented.');
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
	mapUnstakeParamsToWalletParams(params: () => Promise<WalletUnstakeParams>): Promise<any> {
		throw new Error('mapUnstakeParamsToWalletParams not implemented.');
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
	mapFinalizeUnstakeParamsToWalletParams(params: () => Promise<WalletFinalizeUnstakeParams>): Promise<any> {
		throw new Error('mapFinalizeUnstakeParamsToWalletParams not implemented.');
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
	mapOriginateParamsToWalletParams(params: () => Promise<WalletOriginateParams>): Promise<any> {
		throw new Error('mapOriginateParamsToWalletParams not implemented.');
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
	mapDelegateParamsToWalletParams(params: () => Promise<WalletDelegateParams>): Promise<any> {
		throw new Error('mapDelegateParamsToWalletParams not implemented.');
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
	mapIncreasePaidStorageWalletParams(params: () => Promise<WalletIncreasePaidStorageParams>): Promise<any> {
		throw new Error('mapIncreasePaidStorageWalletParams not implemented.');
	}

	/**
	 * Sends Tezos operations to the connected wallet.
	 *
	 * @param params - An array of parameters for the Tezos operation.
	 * @returns A promise that resolves to the operation hash as a string.
	 * @throws Will throw an error if the response payload is not a valid tezos_send result.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async sendOperations(params: any[]): Promise<string> {
		console.log('sendOperations()', params);
		const response = await this._sendTezosWcRequest({
			type: 'request',
			sessionId: this._getSessionId(),
			payload: {
				method: 'tezos_send',
				params: params[0],
			},
		});
		if (!isSendResult(response.payload)) {
			throw new Error('Invalid tezos_send response');
		}
		return response.payload.operationHash;
	}

	/**
	 * Signs the given bytes with an optional watermark.
	 *
	 * @param bytes - The hex string representation of the bytes to be signed.
	 * @param watermark - An optional Uint8Array representing the watermark.
	 *                    If provided, it must be of length 1 and the first element must be 3.
	 * @returns A promise that resolves to the signed payload as a hex string.
	 * @throws Will throw an error if the watermark is provided but not supported.
	 */
	async sign(bytes: string, watermark?: Uint8Array): Promise<string> {
		if (watermark?.length !== 1 || watermark[0] !== 3) {
			throw new Error('Watermark is not supported');
		}
		const bytesBuffer = Buffer.concat([Buffer.from(watermark), Buffer.from(bytes, 'hex')]);
		const watermarkedBytes = bytesBuffer.toString('hex');
		return this.requestSignPayload({
			payload: watermarkedBytes,
			signingType: 'operation',
			sourceAddress: await this.getPKH(),
		});
	}

	// End WalletProvider

	/**
	 * Requests the signing of a payload using the specified signing type.
	 *
	 * @param input - The input parameters for the signing request.
	 * @param input.signingType - The type of signing to be performed. Can be 'operation' or 'micheline'.
	 * @param input.payload - The payload to be signed. Must start with '03' for 'operation' or '05' for 'micheline'.
	 * @param input.sourceAddress - The source address for the signing request. If not provided, the default account address will be used.
	 * @returns A promise that resolves to the signature string.
	 * @throws Will throw an error if the payload does not start with the correct prefix for the specified signing type.
	 * @throws Will throw an error if the response payload is not a valid sign result.
	 */
	async requestSignPayload(input: RequestSignPayloadInput): Promise<string> {
		const { signingType, payload, sourceAddress } = input;
		switch (signingType) {
			case 'operation': {
				if (!payload.startsWith('03')) {
					throw new Error('When using signing type "operation", the payload must start with prefix "03"');
				}
				break;
			}
			case 'micheline': {
				if (!payload.startsWith('05')) {
					throw new Error('When using signing type "micheline", the payload must start with prefix "05"');
				}
				break;
			}
		}
		const response = await this._sendTezosWcRequest({
			type: 'request',
			sessionId: this._getSessionId(),
			payload: {
				method: 'tezos_sign',
				params: {
					account: sourceAddress ?? (await this.getPKH()),
					payload,
				},
			},
		});
		if (!isSignResult(response.payload)) {
			throw new Error('Invalid response');
		}
		return response.payload.signature;
	}

	/**
	 * Creates an event handler for Tezos WalletConnect events.
	 *
	 * This handler processes events of type `TezosWcEvent` and performs actions
	 * based on the event type. It validates the event and then handles the following
	 * event types:
	 *
	 * - `connect`: Resolves the permission request callback with the session ID from the event payload.
	 * - `disconnect`: Emits a 'disconnect' event.
	 *
	 * If an error occurs during event validation or handling, it logs the error to the console.
	 *
	 * @returns A function that handles `TezosWcEvent` events.
	 * @private
	 */
	private _createTezosWcEventHandler() {
		return (event: TezosWcEvent): void => {
			try {
				const validatedEvent = validateTezosWcEvent(event);
				switch (validatedEvent.type) {
					case 'disconnect': {
						this.emit('disconnect', undefined);
						break;
					}
				}
			} catch (error) {
				console.error(error);
			}
		};
	}

	/**
	 * Retrieves the Tezos accounts associated with the current session.
	 *
	 * This method sends a request to the Tezos WalletConnect provider to get the accounts
	 * and returns the first account from the response payload.
	 *
	 * @returns {Promise<GetAccountsResult[0]>} A promise that resolves to the first account in the response payload.
	 * @throws {Error} If the response payload is not a valid `tezos_getAccounts` result.
	 * @private
	 */
	private async _getAccounts(): Promise<GetAccountsResult[0]> {
		const response = await this._sendTezosWcRequest({
			type: 'request',
			sessionId: this._getSessionId(),
			payload: { method: 'tezos_getAccounts', params: {} },
		});
		if (!isGetAccountsResult(response.payload)) {
			throw new Error('Invalid tezos_getAccounts response');
		}
		return response.payload[0];
	}

	/**
	 * Sends a Tezos WalletConnect request and handles the response.
	 *
	 * @param tezosRequest - The Tezos WalletConnect request to be sent.
	 * @returns A promise that resolves to a Tezos WalletConnect response.
	 * @throws Will throw an error if there is no connection, if the response type is different from the request type,
	 * or if the response contains an error.
	 * @private
	 */
	private async _sendTezosWcRequest(tezosRequest: TezosWcConnectRequest): Promise<TezosWcConnectResponse>;
	private async _sendTezosWcRequest(tezosRequest: TezosWcConnectedRequest): Promise<TezosWcConnectedResponse>;
	private async _sendTezosWcRequest(tezosRequest: TezosWcRequestRequest): Promise<TezosWcRequestResponse>;
	private async _sendTezosWcRequest(tezosRequest: TezosWcReconnectRequest): Promise<TezosWcReconnectResponse>;
	private async _sendTezosWcRequest(tezosRequest: TezosWcDisconnectRequest): Promise<TezosWcDisconnectResponse>;
	private async _sendTezosWcRequest(tezosRequest: TezosWcRequest): Promise<TezosWcResponse> {
		if (!this._communicationController.connected()) {
			throw new Error("Can't send request without connection");
		}
		if (this.walletApp && tezosRequest.type === 'request') {
			switch (tezosRequest.payload.method) {
				case 'tezos_send':
				case 'tezos_sign': {
					openLink(getUniversalLink(this.walletApp));
					break;
				}
			}
		}
		const tezosResponse = await this._communicationController.send(tezosRequest);
		const validatedTezosResponse = validateTezosWcResponse(tezosResponse);
		if (validatedTezosResponse.type === 'error') {
			if (validatedTezosResponse.payload.type === 'generic') {
				let errorMessage = `Error Code: ${validatedTezosResponse.payload.key}`;
				if (validatedTezosResponse.payload.message) {
					errorMessage += `: ${validatedTezosResponse.payload.message}`;
				}
				throw new Error(errorMessage);
			} else {
				throw new TezosWcError(
					validatedTezosResponse.payload.type,
					getErrorMessage(validatedTezosResponse.payload.type, validatedTezosResponse.payload.message),
				);
			}
		}
		if (tezosRequest.type !== validatedTezosResponse.type) {
			throw new Error('Response type is different from request type');
		}
		return tezosResponse;
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
