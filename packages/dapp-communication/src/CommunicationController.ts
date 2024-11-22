import { CallbackController, parse, stringify, TypedEvent } from '@tconnect.io/core';
import { io, Socket } from 'socket.io-client';
import {
	CommunicationControllerEvents,
	SerializedCommunicationController,
	WrappedRequest,
	WrappedResponse,
} from './types';
import { validateWrappedResponse } from './validation';

/**
 * The `CommunicationController` class is responsible for managing communication
 * between a client and a server using a socket connection. It handles sending
 * requests, receiving responses, and emitting events.
 *
 * @template Request - The type of the request object.
 * @template Response - The type of the response object.
 * @template Event - The type of the event object.
 *
 * @extends TypedEvent<CommunicationControllerEvents<Event>>
 */
export class CommunicationController<Request, Response, Event> extends TypedEvent<
	CommunicationControllerEvents<Event>
> {
	/**
	 * Creates an instance of CommunicationController.
	 *
	 * @param bridgeUrl - The URL of the bridge server.
	 * @param path - The path for the communication endpoint.
	 * @param requestChannel - The channel used for sending requests.
	 * @param eventChannel - The channel used for receiving events.
	 */
	constructor(bridgeUrl: string, path: string, requestChannel: string, eventChannel: string) {
		super();
		this.bridgeUrl = bridgeUrl;
		this.path = path;
		this.requestChannel = requestChannel;
		this.eventChannel = eventChannel;
	}

	/**
	 * The URL of the bridge server used for communication.
	 * This URL is used to establish a connection between the dApp and the bridge server.
	 *
	 * @readonly
	 */
	readonly bridgeUrl: string;
	/**
	 * The path to the resource or endpoint that this controller communicates with.
	 */
	readonly path: string;
	/**
	 * The channel used for sending requests.
	 * This is a read-only property that specifies the communication channel
	 * through which requests are sent.
	 */
	readonly requestChannel: string;
	/**
	 * The channel through which events are communicated.
	 */
	readonly eventChannel: string;

	/**
	 * A private member variable that holds the instance of the Socket.
	 * It is used to manage the WebSocket connection for communication.
	 * This variable can be undefined if the socket is not initialized.
	 *
	 * @private
	 */
	private _socket: Socket | undefined;
	/**
	 * A private instance of CallbackController that manages request callbacks.
	 * It is initialized with a timeout of 60 seconds (1000 milliseconds * 60).
	 *
	 * @private
	 */
	private _requestCallbacks = new CallbackController<Response>(1000 * 60);

	/**
	 * Establishes a connection to the bridge server using a socket.
	 * If a socket connection already exists, it will be disconnected first.
	 *
	 * @returns {Promise<void>} A promise that resolves when the connection is successfully established.
	 *
	 * @throws {Error} If an error occurs during the connection process.
	 *
	 * @remarks
	 * - The socket uses long polling as the transport method.
	 * - Listens for 'error' events and emits them.
	 * - Listens for responses on the request channel, validates them, and resolves the corresponding callbacks.
	 * - Listens for events on the event channel and emits them.
	 *
	 * @example
	 * ```typescript
	 * const controller = new CommunicationController();
	 * controller.connect().then(() => {
	 *   console.log('Connected successfully');
	 * }).catch((error) => {
	 *   console.error('Connection failed', error);
	 * });
	 * ```
	 */
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

	/**
	 * Checks if the communication controller is connected.
	 *
	 * @returns {boolean} `true` if the socket is connected, otherwise `false`.
	 */
	connected(): boolean {
		return !!this._socket?.connected;
	}

	/**
	 * Sends a request through the established socket connection.
	 *
	 * @param request - The request object to be sent.
	 * @returns A promise that resolves to the response of the request.
	 * @throws Will throw an error if there is no active socket connection.
	 */
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

	/**
	 * Disconnects the current socket connection if it exists.
	 * This method will remove all listeners from the socket and then disconnect it.
	 * After disconnecting, the socket will be set to undefined.
	 */
	disconnect(): void {
		if (this._socket) {
			this._socket.removeAllListeners();
			this._socket.disconnect();
			this._socket = undefined;
		}
	}

	/**
	 * Serializes the current state of the CommunicationController instance into a JSON string.
	 *
	 * @returns {string} A JSON string representing the serialized state of the CommunicationController.
	 */
	serialize(): string {
		return stringify({
			bridgeUrl: this.bridgeUrl,
			path: this.path,
			requestChannel: this.requestChannel,
			eventChannel: this.eventChannel,
		} satisfies SerializedCommunicationController);
	}

	/**
	 * Deserializes a JSON string into a `CommunicationController` instance.
	 *
	 * @template Request - The type of the request.
	 * @template Response - The type of the response.
	 * @template Event - The type of the event.
	 * @param {string} json - The JSON string to deserialize.
	 * @returns {CommunicationController<Request, Response, Event>} - The deserialized `CommunicationController` instance.
	 */
	static deserialize<Request, Response, Event>(json: string): CommunicationController<Request, Response, Event> {
		const { bridgeUrl, path, requestChannel, eventChannel } = parse(json) as SerializedCommunicationController;
		return new CommunicationController<Request, Response, Event>(bridgeUrl, path, requestChannel, eventChannel);
	}
}
