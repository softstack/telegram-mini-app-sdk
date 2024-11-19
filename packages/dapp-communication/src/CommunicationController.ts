import { CallbackController, parse, stringify, TypedEvent } from '@tconnect.io/core';
import { io, Socket } from 'socket.io-client';
import {
	CommunicationControllerEvents,
	SerializedCommunicationController,
	WrappedRequest,
	WrappedResponse,
} from './types';
import { validateWrappedResponse } from './validation';

export class CommunicationController<Request, Response, Event> extends TypedEvent<
	CommunicationControllerEvents<Event>
> {
	constructor(bridgeUrl: string, path: string, requestChannel: string, eventChannel: string) {
		super();
		this.bridgeUrl = bridgeUrl;
		this.path = path;
		this.requestChannel = requestChannel;
		this.eventChannel = eventChannel;
	}

	readonly bridgeUrl: string;
	readonly path: string;
	readonly requestChannel: string;
	readonly eventChannel: string;

	private _socket: Socket | undefined;
	private _requestCallbacks = new CallbackController<Response>(1000 * 60);

	async connect(): Promise<void> {
		if (this._socket) {
			this.disconnect();
		}
		this._socket = io(this.bridgeUrl, {
			path: this.path,
			transports: ['polling'], // Use long polling only
		});

		this._socket.on('error', (error) => {
			try {
				this.emit('error', error);
			} catch (error) {
				console.error(error);
			}
		});

		this._socket.on(this.requestChannel, (wrappedResponse) => {
			try {
				let validatedWrappedResponse: WrappedResponse<Response>;
				try {
					validatedWrappedResponse = validateWrappedResponse(wrappedResponse);
				} catch (error) {
					console.error('Invalid response wrapper', error);
					return;
				}
				this._requestCallbacks.resolveCallback(validatedWrappedResponse.requestId, validatedWrappedResponse.response);
			} catch (error) {
				console.error(error);
			}
		});

		this._socket.on(this.eventChannel, (event) => {
			try {
				this.emit('event', event);
			} catch (error) {
				console.error(error);
			}
		});

		return new Promise<void>((resolve) => {
			try {
				this._socket?.once('connect', () => {
					try {
						resolve();
					} catch (error) {
						console.error(error);
					}
				});
			} catch (error) {
				console.error(error);
			}
		});
	}

	connected(): boolean {
		return !!this._socket?.connected;
	}

	send(request: Request): Promise<Response> {
		if (!this._socket) {
			throw new Error("Can't send request without connection");
		}
		const wrappedRequest: WrappedRequest<Request> = {
			requestId: crypto.randomUUID(),
			request: request,
		};
		const callbackPromise = this._requestCallbacks.addCallback(wrappedRequest.requestId);
		this._socket?.emit(this.requestChannel, wrappedRequest);
		return callbackPromise;
	}

	disconnect(): void {
		if (this._socket) {
			this._socket.removeAllListeners();
			this._socket.disconnect();
			this._socket = undefined;
		}
	}

	serialize(): string {
		return stringify({
			bridgeUrl: this.bridgeUrl,
			path: this.path,
			requestChannel: this.requestChannel,
			eventChannel: this.eventChannel,
		} satisfies SerializedCommunicationController);
	}

	static deserialize<Request, Response, Event>(serialized: string): CommunicationController<Request, Response, Event> {
		const { bridgeUrl, path, requestChannel, eventChannel } = parse(serialized) as SerializedCommunicationController;
		return new CommunicationController<Request, Response, Event>(bridgeUrl, path, requestChannel, eventChannel);
	}
}
