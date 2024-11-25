import { hash } from '@stablelib/blake2b';
import { generateKeyPairFromSeed, KeyPair, sign } from '@stablelib/ed25519';
import { encode } from '@stablelib/utf8';
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
import { CallbackController, parse, stringify, TypedEvent } from '@tconnect.io/core';
import { CommunicationController } from '@tconnect.io/dapp-communication';
import { getErrorMessage } from '@tconnect.io/dapp-utils';
import {
	EVENT_CHANNEL,
	REQUEST_CHANNEL,
	SOCKET_IO_PATH,
	TezosBeaconDisconnectRequest,
	TezosBeaconDisconnectResponse,
	TezosBeaconError,
	TezosBeaconEvent,
	TezosBeaconInitRequest,
	TezosBeaconInitResponse,
	TezosBeaconLoginRequest,
	TezosBeaconLoginResponse,
	TezosBeaconMessageRequest,
	TezosBeaconMessageResponse,
	TezosBeaconReconnectRequest,
	TezosBeaconReconnectResponse,
	TezosBeaconRequest,
	TezosBeaconResponse,
} from '@tconnect.io/tezos-beacon-api-types';
import WebApp from '@twa-dev/sdk';
import bs58check from 'bs58check';
import { GENERIC_WALLET_URL } from './constants';
import {
	DisconnectMessageInput,
	Network,
	OperationRequestInput,
	OperationResponse,
	PartialTezosDelegationOperation,
	PartialTezosIncreasePaidStorageOperation,
	PartialTezosOperation,
	PartialTezosOriginationOperation,
	PartialTezosTransactionOperation,
	PartialTezosTransferTicketOperation,
	PermissionRequest,
	PermissionRequestInput,
	RequestSignPayloadInput,
	SerializedTConnectTezosBeaconProvider,
	SignPayloadRequestInput,
	SignPayloadResponse,
	TConnectTezosBeaconProviderEvents,
	TConnectTezosBeaconProviderOptions,
	TezosBeaconWalletApp,
} from './types';
import { formatTransactionAmount, toIntegerString } from './utils/base';
import {
	createCryptoBoxClient,
	createCryptoBoxServer,
	decryptCryptoboxPayload,
	encryptCryptoboxPayload,
	getAddressFromPublicKey,
	getConnectionStringUniversalLink,
	getSenderId,
	getUniversalLink,
	openCryptobox,
	toHex,
} from './utils/utils';
import {
	isDisconnectMessage,
	isErrorResponse,
	isOperationResponse,
	isPairingResponse,
	isPermissionResponse,
	isSignPayloadResponse,
	validateTezosBeaconEvent,
	validateTezosBeaconResponse,
} from './validation';

/**
 * The `TConnectTezosBeaconProvider` class provides an implementation of a wallet provider
 * for interacting with the Tezos blockchain using the Beacon protocol. It extends the
 * `TypedEvent` class and implements the `WalletProvider` interface.
 *
 * @class
 * @extends {TypedEvent<TConnectTezosBeaconProviderEvents>}
 * @implements {WalletProvider}
 */
export class TConnectTezosBeaconProvider
	extends TypedEvent<TConnectTezosBeaconProviderEvents>
	implements WalletProvider
{
	/**
	 * Creates an instance of TConnectTezosBeaconProvider.
	 *
	 * @param options - The options for configuring the Tezos Beacon Provider.
	 * @param options.appName - The name of the application.
	 * @param options.appUrl - The URL of the application.
	 * @param options.secretSeed - The secret seed used for generating the communication key pair.
	 * @param options.apiKey - The API key for authentication.
	 * @param options.genericWalletUrl - The URL of the generic wallet (optional).
	 * @param options.network - The network configuration (optional, defaults to mainnet).
	 * @param options.bridgeUrl - The URL of the bridge server.
	 * @param options.walletApp - The wallet application instance.
	 */
	constructor(options: TConnectTezosBeaconProviderOptions) {
		super();
		this.appName = options.appName;
		this.appUrl = options.appUrl;
		this.appIcon = options.appIcon;
		this._secretSeed = options.secretSeed;
		this._apiKey = options.apiKey;
		this._genericWalletUrl = options.genericWalletUrl ?? GENERIC_WALLET_URL;
		this.network = options.network ?? { type: 'mainnet' };
		this.bridgeUrl = options.bridgeUrl;
		this.walletApp = options.walletApp;
		this._communicationKeyPair = generateKeyPairFromSeed(hash(encode(this._secretSeed), 32));
		this._communicationController = new CommunicationController(
			this.bridgeUrl,
			SOCKET_IO_PATH,
			REQUEST_CHANNEL,
			EVENT_CHANNEL,
		);
	}

	/**
	 * The name of the application using the Tezos Beacon provider.
	 * This is a read-only property.
	 */
	readonly appName: string;
	/**
	 * The URL of the application that is using the Tezos Beacon provider.
	 * This URL is used to identify the application during the connection process.
	 */
	readonly appUrl: string;
	readonly appIcon: string | undefined;
	/**
	 * The network configuration for the Tezos Beacon provider.
	 * This property is read-only and provides details about the network
	 * to which the provider is connected.
	 */
	readonly network: Network;
	/**
	 * The URL of the bridge server used for communication with the Tezos Beacon network.
	 * This URL is required to establish a connection and interact with the Tezos blockchain.
	 */
	readonly bridgeUrl: string;
	/**
	 * The wallet application instance for the Tezos Beacon provider.
	 * This property holds an instance of `TezosBeaconWalletApp` if available,
	 * otherwise it is `undefined`.
	 */
	readonly walletApp: TezosBeaconWalletApp | undefined;
	private readonly _secretSeed: string;
	private readonly _apiKey: string;
	private readonly _genericWalletUrl: string;
	private readonly _communicationKeyPair: KeyPair;
	private _communicationController: CommunicationController<TezosBeaconRequest, TezosBeaconResponse, TezosBeaconEvent>;
	private _sessionId: string | undefined;
	private _otherPublicKey: Buffer | undefined;
	private _permissionRequestCallbacks = new CallbackController<void>(1000 * 60 * 60);
	private _operationRequestCallbacks = new CallbackController<OperationResponse>(1000 * 60 * 60);
	private _signPayloadRequestCallbacks = new CallbackController<SignPayloadResponse>(1000 * 60 * 60);
	private _publicKey: string | undefined;

	/**
	 * Initiates a permission request to the Tezos Beacon network.
	 *
	 * This method performs the following steps:
	 * 1. Connects to the communication controller.
	 * 2. Sends an initialization request to the Tezos Beacon network.
	 * 3. Signs the login digest with the communication key pair.
	 * 4. Sends a login request to the Tezos Beacon network.
	 * 5. Generates a unique permission request ID.
	 * 6. Adds a callback for the permission request.
	 * 7. Sets up an event handler for communication events.
	 * 8. Opens a link to the wallet app if available.
	 * 9. Emits the connection string event.
	 *
	 * @returns {Promise<void>} A promise that resolves when the permission request is completed.
	 *
	 * @throws {Error} If any step in the process fails.
	 */
	async permissionRequest(): Promise<void> {
		await this._communicationController.connect();
		const initResponse = await this._sendTezosBeaconRequest({
			type: 'init',
			payload: {
				apiKey: this._apiKey,
				appName: this.appName,
				appUrl: this.appUrl,
				appIcon: this.appIcon,
				publicKey: Buffer.from(this._communicationKeyPair.publicKey).toString('hex'),
			},
		});
		this._sessionId = initResponse.payload.sessionId;
		const rawSignature = Buffer.from(
			sign(this._communicationKeyPair.secretKey, Buffer.from(initResponse.payload.loginRawDigest, 'hex')),
		).toString('hex');
		const loginResponse = await this._sendTezosBeaconRequest({
			type: 'login',
			sessionId: this._getSessionId(),
			payload: {
				rawSignature,
			},
		});
		const permissionRequestId = crypto.randomUUID();
		const callbackPromise = this._permissionRequestCallbacks.addCallback(permissionRequestId);
		this._communicationController.on('event', this._createTezosEventHandler(permissionRequestId));
		if (this.walletApp) {
			WebApp.openLink(
				getConnectionStringUniversalLink(
					this.walletApp,
					loginResponse.payload.connectionString,
					this._genericWalletUrl,
				),
			);
		}
		this.emit('connectionString', loginResponse.payload.connectionString);
		return callbackPromise;
	}

	// Start WalletProvider

	/**
	 * Retrieves the public key hash (PKH) associated with the current instance.
	 *
	 * @returns {Promise<string>} A promise that resolves to the PKH as a string.
	 */
	async getPKH(): Promise<string> {
		return getAddressFromPublicKey(this._getPublicKey());
	}

	/**
	 * Retrieves the public key associated with the current instance.
	 *
	 * @returns {Promise<string>} A promise that resolves to the public key as a string.
	 */
	async getPK(): Promise<string> {
		return this._getPublicKey();
	}

	/**
	 * Maps transfer parameters to wallet parameters for a Tezos transaction.
	 *
	 * @param params - A function that returns a promise resolving to `WalletTransferParams`.
	 * @returns A promise that resolves to `PartialTezosTransactionOperation`.
	 *
	 * The function takes the transfer parameters and formats them into the appropriate
	 * wallet parameters required for a Tezos transaction. It handles the conversion of
	 * amounts, fees, gas limits, storage limits, and other necessary fields.
	 *
	 * The resulting object includes:
	 * - `amount`: The formatted transaction amount.
	 * - `destination`: The destination address.
	 * - `fee`: The transaction fee, if provided.
	 * - `gas_limit`: The gas limit for the transaction, if provided.
	 * - `kind`: The type of operation, which is 'transaction'.
	 * - `parameters`: Additional parameters for the transaction.
	 * - `source`: The source address derived from the public key, if available.
	 * - `storage_limit`: The storage limit for the transaction, if provided.
	 *
	 * The function logs the transfer parameters for debugging purposes.
	 */
	async mapTransferParamsToWalletParams(
		params: () => Promise<WalletTransferParams>,
	): Promise<PartialTezosTransactionOperation> {
		const transferParameters = await params();
		console.log('mapTransferParamsToWalletParams()', transferParameters);
		return {
			amount: formatTransactionAmount(transferParameters.amount, transferParameters.mutez),
			destination: transferParameters.to,
			fee: transferParameters.fee === undefined ? undefined : toIntegerString(transferParameters.fee),
			gas_limit: transferParameters.gasLimit === undefined ? undefined : toIntegerString(transferParameters.gasLimit),
			kind: 'transaction',
			parameters: transferParameters.parameter as PartialTezosTransactionOperation['parameters'],
			source: this._publicKey === undefined ? undefined : getAddressFromPublicKey(this._publicKey),
			storage_limit:
				transferParameters.storageLimit === undefined ? undefined : toIntegerString(transferParameters.storageLimit),
		};
	}

	/**
	 * Maps the transfer ticket parameters to wallet parameters.
	 *
	 * @param params - A function that returns a promise resolving to `WalletTransferTicketParams`.
	 * @returns A promise that resolves to a partial `TezosTransferTicketOperation`.
	 * @throws An error indicating that the method is not implemented yet.
	 */
	async mapTransferTicketParamsToWalletParams(
		params: () => Promise<WalletTransferTicketParams>,
	): Promise<PartialTezosTransferTicketOperation> {
		const transferTicketParameters = await params();
		console.log('mapTransferTicketParamsToWalletParams()', transferTicketParameters);
		throw new Error('mapTransferTicketParamsToWalletParams not implemented yet');
	}

	/**
	 * Maps the staking parameters to wallet transaction parameters.
	 *
	 * @param params - A function that returns a promise resolving to `WalletStakeParams`.
	 * @returns A promise that resolves to `PartialTezosTransactionOperation` containing the mapped transaction parameters.
	 *
	 * The returned object includes:
	 * - `amount`: The formatted transaction amount.
	 * - `destination`: The destination address, derived from the public key if not provided.
	 * - `fee`: The transaction fee, converted to a string if defined.
	 * - `gas_limit`: The gas limit for the transaction, converted to a string if defined.
	 * - `kind`: The type of operation, which is 'transaction'.
	 * - `parameters`: The transaction parameters.
	 * - `source`: The source address, derived from the public key if available.
	 * - `storage_limit`: The storage limit for the transaction, converted to a string if defined.
	 *
	 * @throws Will throw an error if the mapping is not implemented yet.
	 */
	async mapStakeParamsToWalletParams(
		params: () => Promise<WalletStakeParams>,
	): Promise<PartialTezosTransactionOperation> {
		const stakeParameters = await params();
		console.log('mapStakeParamsToWalletParams()', stakeParameters);
		// throw new Error('mapStakeParamsToWalletParams not implemented yet');
		return {
			amount: formatTransactionAmount(stakeParameters.amount, stakeParameters.mutez),
			destination: stakeParameters.to ?? getAddressFromPublicKey(this._getPublicKey()),
			fee: stakeParameters.fee === undefined ? undefined : toIntegerString(stakeParameters.fee),
			gas_limit: stakeParameters.gasLimit === undefined ? undefined : toIntegerString(stakeParameters.gasLimit),
			kind: 'transaction',
			parameters: stakeParameters.parameter as PartialTezosTransactionOperation['parameters'],
			source: this._publicKey === undefined ? undefined : getAddressFromPublicKey(this._publicKey),
			storage_limit:
				stakeParameters.storageLimit === undefined ? undefined : toIntegerString(stakeParameters.storageLimit),
		};
	}

	/**
	 * Maps unstake parameters to wallet parameters.
	 *
	 * @param params - A function that returns a promise resolving to `WalletUnstakeParams`.
	 * @returns A promise that resolves to `PartialTezosTransactionOperation`.
	 *
	 * The function takes unstake parameters and maps them to the corresponding wallet parameters
	 * required for a Tezos transaction operation. It formats the transaction amount, sets the
	 * destination address, and includes optional fee, gas limit, and storage limit parameters.
	 * The source address is derived from the public key if available.
	 */
	async mapUnstakeParamsToWalletParams(
		params: () => Promise<WalletUnstakeParams>,
	): Promise<PartialTezosTransactionOperation> {
		const unstakeParameters = await params();
		console.log('mapUnstakeParamsToWalletParams()', unstakeParameters);
		// throw new Error('mapUnstakeParamsToWalletParams not implemented yet');
		return {
			amount: formatTransactionAmount(unstakeParameters.amount, unstakeParameters.mutez),
			destination: unstakeParameters.to ?? getAddressFromPublicKey(this._getPublicKey()),
			fee: unstakeParameters.fee === undefined ? undefined : toIntegerString(unstakeParameters.fee),
			gas_limit: unstakeParameters.gasLimit === undefined ? undefined : toIntegerString(unstakeParameters.gasLimit),
			kind: 'transaction',
			parameters: unstakeParameters.parameter as PartialTezosTransactionOperation['parameters'],
			source: this._publicKey === undefined ? undefined : getAddressFromPublicKey(this._publicKey),
			storage_limit:
				unstakeParameters.storageLimit === undefined ? undefined : toIntegerString(unstakeParameters.storageLimit),
		};
	}

	/**
	 * Maps the finalize unstake parameters to wallet parameters.
	 *
	 * @param params - A function that returns a promise resolving to `WalletFinalizeUnstakeParams`.
	 * @returns A promise that resolves to `PartialTezosTransactionOperation`.
	 * @throws Will throw an error if the amount is undefined.
	 */
	async mapFinalizeUnstakeParamsToWalletParams(
		params: () => Promise<WalletFinalizeUnstakeParams>,
	): Promise<PartialTezosTransactionOperation> {
		const finalizeUnstakeParameters = await params();
		console.log('mapFinalizeUnstakeParamsToWalletParams()', finalizeUnstakeParameters);
		// throw new Error('mapFinalizeUnstakeParamsToWalletParams not implemented yet');
		if (finalizeUnstakeParameters.amount === undefined) {
			throw new Error('Amount is required');
		}
		return {
			amount: formatTransactionAmount(finalizeUnstakeParameters.amount, finalizeUnstakeParameters.mutez),
			destination: finalizeUnstakeParameters.to ?? getAddressFromPublicKey(this._getPublicKey()),
			fee: finalizeUnstakeParameters.fee === undefined ? undefined : toIntegerString(finalizeUnstakeParameters.fee),
			gas_limit:
				finalizeUnstakeParameters.gasLimit === undefined
					? undefined
					: toIntegerString(finalizeUnstakeParameters.gasLimit),
			kind: 'transaction',
			parameters: finalizeUnstakeParameters.parameter as PartialTezosTransactionOperation['parameters'],
			source: this._publicKey === undefined ? undefined : getAddressFromPublicKey(this._publicKey),
			storage_limit:
				finalizeUnstakeParameters.storageLimit === undefined
					? undefined
					: toIntegerString(finalizeUnstakeParameters.storageLimit),
		};
	}

	async mapOriginateParamsToWalletParams(
		params: () => Promise<WalletOriginateParams>,
	): Promise<PartialTezosOriginationOperation> {
		const originateParameters = await params();
		console.log('mapOriginateParamsToWalletParams()', originateParameters);
		throw new Error('mapOriginateParamsToWalletParams not implemented yet');
		// const { code, init, storage, storageLimit, balance, delegate, fee, gasLimit, mutez } = originateParameters;
		// const script = {
		// 	code,
		// 	storage: contractStorage,
		// };
		// return {
		// 	kind: 'origination',
		// };
	}

	/**
	 * Maps delegate parameters to wallet parameters for a Tezos delegation operation.
	 *
	 * @param params - A function that returns a promise resolving to `WalletDelegateParams`.
	 * @returns A promise that resolves to a partial Tezos delegation operation object.
	 *
	 * The returned object contains the following properties:
	 * - `delegate`: The delegate address.
	 * - `fee`: The fee for the operation, converted to a string if defined.
	 * - `gas_limit`: The gas limit for the operation, converted to a string if defined.
	 * - `kind`: The kind of operation, which is always 'delegation'.
	 * - `storage_limit`: The storage limit for the operation, converted to a string if defined.
	 */
	async mapDelegateParamsToWalletParams(
		params: () => Promise<WalletDelegateParams>,
	): Promise<PartialTezosDelegationOperation> {
		const delegateParameters = await params();
		console.log('mapDelegateParamsToWalletParams()', delegateParameters);
		// throw new Error('mapDelegateParamsToWalletParams not implemented yet');
		return {
			delegate: delegateParameters.delegate,
			fee: delegateParameters.fee === undefined ? undefined : toIntegerString(delegateParameters.fee),
			gas_limit: delegateParameters.gasLimit === undefined ? undefined : toIntegerString(delegateParameters.gasLimit),
			kind: 'delegation',
			storage_limit:
				delegateParameters.storageLimit === undefined ? undefined : toIntegerString(delegateParameters.storageLimit),
		};
	}

	/**
	 * Maps the parameters for increasing paid storage in a wallet to a partial Tezos increase paid storage operation.
	 *
	 * @param params - A function that returns a promise resolving to `WalletIncreasePaidStorageParams`.
	 * @returns A promise that resolves to a `PartialTezosIncreasePaidStorageOperation` object.
	 *
	 * The returned object contains:
	 * - `amount`: The formatted transaction amount.
	 * - `destination`: The destination address for the storage increase.
	 * - `fee`: The fee for the operation, if defined.
	 * - `gas_limit`: The gas limit for the operation, if defined.
	 * - `kind`: The kind of operation, which is 'increase_paid_storage'.
	 * - `storage_limit`: The storage limit for the operation, if defined.
	 */
	async mapIncreasePaidStorageWalletParams(
		params: () => Promise<WalletIncreasePaidStorageParams>,
	): Promise<PartialTezosIncreasePaidStorageOperation> {
		const increasePaidStorageParameters = await params();
		console.log('mapIncreasePaidStorageWalletParams()', increasePaidStorageParameters);
		// throw new Error('mapIncreasePaidStorageWalletParams not implemented yet');
		return {
			amount: formatTransactionAmount(increasePaidStorageParameters.amount, true),
			destination: increasePaidStorageParameters.destination,
			fee:
				increasePaidStorageParameters.fee === undefined
					? undefined
					: toIntegerString(increasePaidStorageParameters.fee),
			gas_limit:
				increasePaidStorageParameters.gasLimit === undefined
					? undefined
					: toIntegerString(increasePaidStorageParameters.gasLimit),
			kind: 'increase_paid_storage',
			storage_limit:
				increasePaidStorageParameters.storageLimit === undefined
					? undefined
					: toIntegerString(increasePaidStorageParameters.storageLimit),
		};
	}

	/**
	 * Sends an array of Tezos operations to be processed.
	 *
	 * @param {Array<PartialTezosOperation>} params - An array of partial Tezos operations to be sent.
	 * @returns {Promise<string>} A promise that resolves to the transaction hash of the sent operations.
	 * @throws Will throw an error if the operation request fails.
	 */
	async sendOperations(params: Array<PartialTezosOperation>): Promise<string> {
		console.log('sendOperations()', params);
		// throw new Error('sendOperations not implemented yet');
		const response = await this._sendTezosMessage({
			type: 'operation_request',
			network: this.network,
			operationDetails: params,
			sourceAddress: getAddressFromPublicKey(this._getPublicKey()),
		});
		return response.transactionHash;
	}

	/**
	 * Signs the given bytes with an optional watermark.
	 *
	 * @param bytes - The hexadecimal string representing the bytes to be signed.
	 * @param watermark - An optional Uint8Array representing the watermark.
	 *                    The watermark must be a single byte with the value 3.
	 * @returns A promise that resolves to the signature string.
	 * @throws Will throw an error if the watermark is not supported.
	 */
	async sign(bytes: string, watermark?: Uint8Array): Promise<string> {
		console.log('sign()', bytes, watermark);
		// throw new Error('sign not implemented yet');

		if (watermark?.length !== 1 || watermark[0] !== 3) {
			throw new Error('Watermark is not supported');
		}
		const bytesBuffer = Buffer.concat([Buffer.from(watermark), Buffer.from(bytes, 'hex')]);
		const watermarkedBytes = bytesBuffer.toString('hex');
		const response = await this._sendTezosMessage({
			type: 'sign_payload_request',
			payload: watermarkedBytes,
			sourceAddress: getAddressFromPublicKey(this._getPublicKey()),
			signingType: 'operation',
		});
		return response.signature;
	}

	// End WalletProvider

	/**
	 * Requests the signing of a payload with the specified signing type.
	 *
	 * @param input - The input parameters for the signing request.
	 * @param input.signingType - The type of signing to be performed. Can be 'operation' or 'micheline'.
	 * @param input.payload - The payload to be signed. Must start with '03' if signing type is 'operation', or '05' if signing type is 'micheline'.
	 * @param input.sourceAddress - (Optional) The source address for the signing request. If not provided, it will be derived from the public key.
	 *
	 * @returns A promise that resolves to a `SignPayloadResponse` containing the signed payload.
	 *
	 * @throws An error if the payload does not start with the required prefix for the specified signing type.
	 */
	async requestSignPayload(input: RequestSignPayloadInput): Promise<SignPayloadResponse> {
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
		const response = await this._sendTezosMessage({
			type: 'sign_payload_request',
			payload,
			sourceAddress: sourceAddress ?? getAddressFromPublicKey(this._getPublicKey()),
			signingType: signingType ?? 'raw',
		});
		return response;
	}

	/**
	 * Checks if the provider is currently connected.
	 *
	 * @returns {boolean} `true` if the provider is connected, otherwise `false`.
	 */
	connected(): boolean {
		return this._communicationController.connected();
	}

	/**
	 * Disconnects the Tezos Beacon Provider.
	 *
	 * This method sends a 'disconnect' message to the Tezos network and then performs
	 * necessary cleanup operations. It emits a 'disconnect' event and disconnects the
	 * communication controller.
	 *
	 * @returns {Promise<void>} A promise that resolves when the disconnection process is complete.
	 */
	async disconnect(): Promise<void> {
		try {
			await this._sendTezosMessage({ type: 'disconnect' });
		} finally {
			this.emit('disconnect', undefined);
			this._communicationController.disconnect();
		}
	}

	/**
	 * Serializes the TConnectTezosBeaconProvider instance into a string.
	 *
	 * The serialized string includes the following properties:
	 * - `appName`: The name of the application.
	 * - `appUrl`: The URL of the application.
	 * - `network`: The network configuration.
	 * - `bridgeUrl`: The URL of the bridge.
	 * - `walletApp`: The wallet application information.
	 * - `_secretSeed`: The secret seed used for encryption.
	 * - `_apiKey`: The API key for authentication.
	 * - `_genericWalletUrl`: The URL of the generic wallet.
	 * - `_communicationController`: The serialized communication controller.
	 * - `_sessionId`: The session ID.
	 * - `_otherPublicKey`: The public key of the other party.
	 * - `_publicKey`: The public key of the current instance.
	 *
	 * @returns {string} The serialized string representation of the instance.
	 */
	serialize(): string {
		return stringify({
			appName: this.appName,
			appUrl: this.appUrl,
			appIcon: this.appIcon,
			network: this.network,
			bridgeUrl: this.bridgeUrl,
			walletApp: this.walletApp,
			_secretSeed: this._secretSeed,
			_apiKey: this._apiKey,
			_genericWalletUrl: this._genericWalletUrl,
			_communicationController: this._communicationController.serialize(),
			_sessionId: this._getSessionId(),
			_otherPublicKey: this._getOtherPublicKey(),
			_publicKey: this._getPublicKey(),
		} satisfies SerializedTConnectTezosBeaconProvider);
	}

	/**
	 * Deserializes a string into a `TConnectTezosBeaconProvider` instance.
	 *
	 * @param serialized - The serialized string representation of the `TConnectTezosBeaconProvider`.
	 * @returns A promise that resolves to a `TConnectTezosBeaconProvider` instance.
	 */
	static async deserialize(serialized: string): Promise<TConnectTezosBeaconProvider> {
		const data = parse(serialized) as SerializedTConnectTezosBeaconProvider;
		const provider = new TConnectTezosBeaconProvider({
			appName: data.appName,
			appUrl: data.appUrl,
			appIcon: data.appIcon,
			secretSeed: data._secretSeed,
			apiKey: data._apiKey,
			network: data.network,
			bridgeUrl: data.bridgeUrl,
			walletApp: data.walletApp,
			genericWalletUrl: data._genericWalletUrl,
		});
		provider._communicationController = CommunicationController.deserialize(data._communicationController);
		provider._sessionId = data._sessionId;
		provider._otherPublicKey = data._otherPublicKey;
		provider._publicKey = data._publicKey;
		await provider._reconnect();
		return provider;
	}

	/**
	 * Reconnects the Tezos Beacon provider by setting up the communication controller
	 * and sending a reconnect request.
	 *
	 * @private
	 * @returns {Promise<void>} A promise that resolves when the reconnection process is complete.
	 */
	private async _reconnect(): Promise<void> {
		this._communicationController.on('event', this._createTezosEventHandler(undefined));
		await this._communicationController.connect();
		await this._sendTezosBeaconRequest({ type: 'reconnect', sessionId: this._getSessionId() });
	}

	/**
	 * Creates an event handler for Tezos Beacon events.
	 *
	 * @param permissionRequestId - The ID of the permission request, if available.
	 * @returns A function that handles Tezos Beacon events.
	 *
	 * The returned function processes the following event types:
	 * - 'message': Handles incoming messages, decrypts and processes them based on their type.
	 * - 'disconnect': Emits a 'disconnect' event.
	 *
	 * The 'message' event type can handle the following message types:
	 * - PermissionRequest: Sends a permission request message.
	 * - PermissionResponse: Resolves the permission request callback with the response.
	 * - OperationResponse: Resolves the operation request callback with the response.
	 * - SignPayloadResponse: Resolves the sign payload request callback with the response.
	 * - DisconnectMessage: Disconnects the provider.
	 * - ErrorResponse: Rejects the appropriate callback with an error.
	 *
	 * If an error occurs during event processing, it is logged to the console.
	 */
	private _createTezosEventHandler(
		permissionRequestId: string | undefined,
	): (event: TezosBeaconEvent) => Promise<void> {
		return async (event: TezosBeaconEvent) => {
			try {
				event = validateTezosBeaconEvent(event);
				switch (event.type) {
					case 'message': {
						const bodySplits = event.payload.message.split(':');
						if (bodySplits.length > 1) {
							if (permissionRequestId) {
								const encryptedJson = bodySplits.at(-1);
								if (!encryptedJson) {
									throw new Error('Empty text message');
								}
								const pairingResponse = JSON.parse(
									openCryptobox(
										Buffer.from(encryptedJson, 'hex'),
										this._communicationKeyPair.publicKey,
										this._communicationKeyPair.secretKey,
									),
								);
								if (isPairingResponse(pairingResponse)) {
									this._otherPublicKey = Buffer.from(pairingResponse.publicKey, 'hex');
									const message: PermissionRequest = {
										id: permissionRequestId,
										type: 'permission_request',
										version: '2',
										senderId: getSenderId(toHex(this._communicationKeyPair.publicKey)),
										appMetadata: {
											senderId: getSenderId(toHex(this._communicationKeyPair.publicKey)),
											name: this.appName,
											icon: this.appIcon,
										},
										network: this.network,
										scopes: ['operation_request', 'sign'],
									};
									await this._sendTezosMessage(message);
								} else {
									console.log("pairingResponse isn't valid", pairingResponse);
								}
							}
						} else if (this._otherPublicKey) {
							const sharedKey = createCryptoBoxServer(
								this._getOtherPublicKey().toString('hex'),
								this._communicationKeyPair,
							);
							const decryptedMessage = decryptCryptoboxPayload(
								Buffer.from(event.payload.message, 'hex'),
								sharedKey.receive,
							);
							const message = JSON.parse(Buffer.from(bs58check.decode(decryptedMessage)).toString('utf8'));
							if (isPermissionResponse(message)) {
								console.log('PermissionResponse', message);
								this._publicKey = message.publicKey;
								this._permissionRequestCallbacks.resolveCallback(message.id, undefined);
							} else if (isOperationResponse(message)) {
								console.log('OperationResponse', message);
								this._operationRequestCallbacks.resolveCallback(message.id, message);
							} else if (isSignPayloadResponse(message)) {
								console.log('SignPayloadResponse', message);
								this._signPayloadRequestCallbacks.resolveCallback(message.id, message);
							} else if (isDisconnectMessage(message)) {
								console.log('DisconnectMessage', message);
								this.disconnect();
							} else if (isErrorResponse(message)) {
								console.error('ErrorResponse', message);
								this._permissionRequestCallbacks.rejectCallback(message.id, new Error(message.errorType));
								this._operationRequestCallbacks.rejectCallback(message.id, new Error(message.errorType));
								this._signPayloadRequestCallbacks.rejectCallback(message.id, new Error(message.errorType));
							} else {
								console.log('Unknown message', message);
							}
						}
						break;
					}
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
	 * Sends a Tezos message to the wallet application.
	 *
	 * @param partialMessage - The message to be sent. It can be of type `PermissionRequestInput`, `OperationRequestInput`, `SignPayloadRequestInput`, or `DisconnectMessageInput`.
	 * @returns A promise that resolves to `void`, `OperationResponse`, or `SignPayloadResponse` depending on the type of the message.
	 *
	 * The function constructs a complete message by adding necessary fields such as `version` and `senderId` to the `partialMessage`.
	 * It then encrypts the message using a shared key derived from the communication key pair.
	 *
	 * If the wallet application is available and the message type is either `operation_request` or `sign_payload_request`,
	 * it opens a universal link to the wallet application.
	 *
	 * Depending on the message type, it sends the encrypted message to the Tezos beacon and handles the response accordingly:
	 * - For `operation_request`, it adds a callback and waits for the response.
	 * - For `sign_payload_request`, it adds a callback and waits for the response.
	 * - For `disconnect`, it sends a disconnect request.
	 * - For other message types, it sends a generic message request.
	 */
	private async _sendTezosMessage(partialMessage: PermissionRequestInput): Promise<void>;
	private async _sendTezosMessage(partialMessage: OperationRequestInput): Promise<OperationResponse>;
	private async _sendTezosMessage(partialMessage: SignPayloadRequestInput): Promise<SignPayloadResponse>;
	// eslint-disable-next-line @typescript-eslint/unified-signatures
	private async _sendTezosMessage(partialMessage: DisconnectMessageInput): Promise<void>;
	private async _sendTezosMessage(
		partialMessage: PermissionRequestInput | OperationRequestInput | SignPayloadRequestInput | DisconnectMessageInput,
		// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
	): Promise<void | OperationResponse | SignPayloadResponse> {
		const message =
			partialMessage.type === 'permission_request'
				? {
						...partialMessage,
						version: '2',
						senderId: getSenderId(toHex(this._communicationKeyPair.publicKey)),
					}
				: {
						...partialMessage,
						id: crypto.randomUUID(),
						version: '2',
						senderId: getSenderId(toHex(this._communicationKeyPair.publicKey)),
					};
		const sharedKey = createCryptoBoxClient(this._getOtherPublicKey().toString('hex'), this._communicationKeyPair);
		const encryptedMessage = encryptCryptoboxPayload(
			bs58check.encode(Buffer.from(JSON.stringify(message), 'utf8')),
			sharedKey.send,
		);
		if (this.walletApp) {
			switch (message.type) {
				case 'operation_request':
				case 'sign_payload_request': {
					const universalLink = getUniversalLink(this.walletApp);
					if (universalLink) {
						WebApp.openLink(universalLink);
					}
				}
			}
		}
		switch (message.type) {
			case 'operation_request': {
				const callbackPromise = this._operationRequestCallbacks.addCallback(message.id);
				await this._sendTezosBeaconRequest({
					type: 'message',
					sessionId: this._getSessionId(),
					payload: { message: encryptedMessage },
				});
				return callbackPromise;
			}
			case 'sign_payload_request': {
				const callbackPromise = this._signPayloadRequestCallbacks.addCallback(message.id);
				await this._sendTezosBeaconRequest({
					type: 'message',
					sessionId: this._getSessionId(),
					payload: { message: encryptedMessage },
				});
				return callbackPromise;
			}
			case 'disconnect': {
				await this._sendTezosBeaconRequest({
					type: 'disconnect',
					sessionId: this._getSessionId(),
					payload: { message: encryptedMessage },
				});
				return;
			}
		}
		await this._sendTezosBeaconRequest({
			type: 'message',
			sessionId: this._getSessionId(),
			payload: { message: encryptedMessage },
		});
	}

	/**
	 * Sends a Tezos Beacon request and handles the response.
	 *
	 * @param tezosRequest - The Tezos Beacon request to be sent.
	 * @returns A promise that resolves to a Tezos Beacon response.
	 * @throws Will throw an error if there is no connection, if the response contains an error, or if the response type does not match the request type.
	 */
	private async _sendTezosBeaconRequest(tezosRequest: TezosBeaconInitRequest): Promise<TezosBeaconInitResponse>;
	private async _sendTezosBeaconRequest(tezosRequest: TezosBeaconLoginRequest): Promise<TezosBeaconLoginResponse>;
	private async _sendTezosBeaconRequest(tezosRequest: TezosBeaconMessageRequest): Promise<TezosBeaconMessageResponse>;
	private async _sendTezosBeaconRequest(
		tezosRequest: TezosBeaconReconnectRequest,
	): Promise<TezosBeaconReconnectResponse>;
	private async _sendTezosBeaconRequest(
		tezosRequest: TezosBeaconDisconnectRequest,
	): Promise<TezosBeaconDisconnectResponse>;
	private async _sendTezosBeaconRequest(tezosRequest: TezosBeaconRequest): Promise<TezosBeaconResponse> {
		if (!this._communicationController.connected()) {
			throw new Error("Can't send request without connection");
		}
		const tezosResponse = await this._communicationController.send(tezosRequest);
		const validatedTezosResponse = validateTezosBeaconResponse(tezosResponse);
		if (validatedTezosResponse.type === 'error') {
			if (validatedTezosResponse.payload.type === 'generic') {
				let errorMessage = `Error Code: ${validatedTezosResponse.payload.key}`;
				if (validatedTezosResponse.payload.message) {
					errorMessage += `: ${validatedTezosResponse.payload.message}`;
				}
				throw new Error(errorMessage);
			} else {
				throw new TezosBeaconError(
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
	 * Retrieves the public key.
	 *
	 * @returns {string} The public key.
	 * @throws {Error} If the public key is not set.
	 * @private
	 */
	private _getPublicKey(): string {
		if (!this._publicKey) {
			throw new Error('Public key is not set');
		}
		return this._publicKey;
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
	 * Retrieves the public key of the other party (e.g., wallet).
	 *
	 * @returns {Buffer} The public key of the other party.
	 * @throws {Error} If the wallet public key is not set.
	 * @private
	 */
	private _getOtherPublicKey(): Buffer {
		if (!this._otherPublicKey) {
			throw new Error('Wallet public key is not set');
		}
		return this._otherPublicKey;
	}
}
