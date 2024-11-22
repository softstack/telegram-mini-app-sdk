"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunicationController = void 0;
const core_1 = require("@tconnect.io/core");
const socket_io_client_1 = require("socket.io-client");
const validation_1 = require("./validation");
class CommunicationController extends core_1.TypedEvent {
    constructor(bridgeUrl, path, requestChannel, eventChannel) {
        super();
        this._requestCallbacks = new core_1.CallbackController(1000 * 60);
        this.bridgeUrl = bridgeUrl;
        this.path = path;
        this.requestChannel = requestChannel;
        this.eventChannel = eventChannel;
    }
    async connect() {
        if (this._socket) {
            this.disconnect();
        }
        this._socket = (0, socket_io_client_1.io)(this.bridgeUrl, {
            path: this.path,
            transports: ['polling'],
        });
        this._socket.on('error', (error) => {
            try {
                this.emit('error', error);
            }
            catch (error) {
                console.error(error);
            }
        });
        this._socket.on(this.requestChannel, (wrappedResponse) => {
            try {
                let validatedWrappedResponse;
                try {
                    validatedWrappedResponse = (0, validation_1.validateWrappedResponse)(wrappedResponse);
                }
                catch (error) {
                    console.error('Invalid response wrapper', error);
                    return;
                }
                this._requestCallbacks.resolveCallback(validatedWrappedResponse.requestId, validatedWrappedResponse.response);
            }
            catch (error) {
                console.error(error);
            }
        });
        this._socket.on(this.eventChannel, (event) => {
            try {
                this.emit('event', event);
            }
            catch (error) {
                console.error(error);
            }
        });
        return new Promise((resolve) => {
            try {
                this._socket?.once('connect', () => {
                    try {
                        resolve();
                    }
                    catch (error) {
                        console.error(error);
                    }
                });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    connected() {
        return !!this._socket?.connected;
    }
    send(request) {
        if (!this._socket) {
            throw new Error("Can't send request without connection");
        }
        const wrappedRequest = {
            requestId: crypto.randomUUID(),
            request: request,
        };
        const callbackPromise = this._requestCallbacks.addCallback(wrappedRequest.requestId);
        this._socket?.emit(this.requestChannel, wrappedRequest);
        return callbackPromise;
    }
    disconnect() {
        if (this._socket) {
            this._socket.removeAllListeners();
            this._socket.disconnect();
            this._socket = undefined;
        }
    }
    serialize() {
        return (0, core_1.stringify)({
            bridgeUrl: this.bridgeUrl,
            path: this.path,
            requestChannel: this.requestChannel,
            eventChannel: this.eventChannel,
        });
    }
    static deserialize(json) {
        const { bridgeUrl, path, requestChannel, eventChannel } = (0, core_1.parse)(json);
        return new CommunicationController(bridgeUrl, path, requestChannel, eventChannel);
    }
}
exports.CommunicationController = CommunicationController;
//# sourceMappingURL=CommunicationController.js.map