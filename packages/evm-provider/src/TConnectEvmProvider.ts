import { isAndroid } from '@tconnect.io/dapp-utils';
import { parse, sleep, stringify, TypedEvent } from '@tconnect.io/core';
import { CommunicationController } from '@tconnect.io/dapp-communication';
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
} from '@tconnect.io/evm-api-types';
import WebApp from '@twa-dev/sdk';
import { SOCKET_IO_PATH } from './constants';
import { ProviderRpcError } from './ProviderRpcError';
import {
	EIP1193Provider,
	EvmWalletApp,
	RequestArguments,
	SerializedTConnectEvmProvider,
	TConnectEvmProviderEvents,
	TConnectEvmProviderOptions,
} from './types';
import { getUniversalLink, getWalletConnectUniversalLink } from './utils';
import { validateEvmEvent, validateEvmResponse } from './validation';

export class TConnectEvmProvider extends TypedEvent<TConnectEvmProviderEvents> implements EIP1193Provider {
	constructor(options: TConnectEvmProviderOptions) {
		super();
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

	readonly bridgeUrl: string;
	readonly walletApp: EvmWalletApp | undefined;

	private readonly _apiKey: string;
	private _communicationController: CommunicationController<EvmRequest, EvmResponse, EvmEvent>;
	private _sessionId: string | undefined;
	private _walletConnectUri: string | undefined;

	async connect(): Promise<void> {
		if (this._communicationController.connected()) {
			await this.disconnect();
		}
		await this._communicationController.connect();

		this._communicationController.on('event', this._createEvmEventHandler());

		const {
			payload: { sessionId, walletConnectUri },
		} = await this._sendEvmRequest({
			type: 'connect',
			payload: { apiKey: this._apiKey },
		});
		this._sessionId = sessionId;
		this._walletConnectUri = walletConnectUri;
		if (this.walletApp) {
			// Android needs a second reminder to open the link
			if (isAndroid()) {
				WebApp.openLink(getWalletConnectUniversalLink(this.walletApp, walletConnectUri), { try_instant_view: true });
				await sleep(1000);
				WebApp.openLink(getWalletConnectUniversalLink(this.walletApp, walletConnectUri), { try_instant_view: true });
			} else {
				WebApp.openLink(getWalletConnectUniversalLink(this.walletApp, walletConnectUri));
			}
		}
		this.emit('connectionString', walletConnectUri);
	}

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

	async disconnect(): Promise<void> {
		try {
			await this._communicationController.send({ type: 'disconnect', sessionId: this._getSessionId() });
		} finally {
			this.emit('disconnect', new ProviderRpcError('Disconnected', 4900));
			this._communicationController.disconnect();
		}
	}

	serialize(): string {
		return stringify({
			bridgeUrl: this.bridgeUrl,
			walletApp: this.walletApp,
			_apiKey: this._apiKey,
			_communicationController: this._communicationController.serialize(),
			_sessionId: this._getSessionId(),
			_walletConnectUri: this._getWalletConnectUri(),
		} satisfies SerializedTConnectEvmProvider);
	}

	static async deserialize(serialized: string): Promise<TConnectEvmProvider> {
		const data = parse(serialized) as SerializedTConnectEvmProvider;
		const provider = new TConnectEvmProvider({
			bridgeUrl: data.bridgeUrl,
			apiKey: data._apiKey,
			walletApp: data.walletApp,
		});
		provider._communicationController = CommunicationController.deserialize(data._communicationController);
		provider._sessionId = data._sessionId;
		provider._walletConnectUri = data._walletConnectUri;
		await provider._reconnect();
		return provider;
	}

	private async _reconnect(): Promise<void> {
		this._communicationController.on('event', this._createEvmEventHandler());
		await this._communicationController.connect();
		await this._sendEvmRequest({ type: 'reconnect', sessionId: this._getSessionId() });
	}

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
				throw new EvmError(validatedEvmResponse.payload.type, validatedEvmResponse.payload.message);
			}
		}
		if (evmRequest.type !== validatedEvmResponse.type) {
			throw new Error('Response type is different from request type');
		}
		return evmResponse;
	}

	private _getSessionId(): string {
		if (!this._sessionId) {
			throw new Error('Session ID is not set');
		}
		return this._sessionId;
	}

	private _getWalletConnectUri(): string {
		if (!this._walletConnectUri) {
			throw new Error('WalletConnect URI is not set');
		}
		return this._walletConnectUri;
	}
}
