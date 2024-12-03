import { parse, sleep, stringify, TypedEvent } from '@tconnect.io/core';
import { CommunicationController } from '@tconnect.io/dapp-communication';
import { getErrorMessage, isAndroid } from '@tconnect.io/dapp-utils';
import { EVENT_CHANNEL, EvmError, REQUEST_CHANNEL, SOCKET_IO_PATH, } from '@tconnect.io/evm-api-types';
import WebApp from '@twa-dev/sdk';
import { ProviderRpcError } from './ProviderRpcError';
import { getConnectionStringUniversalLink, getUniversalLink } from './utils';
import { validateEvmEvent, validateEvmResponse } from './validation';
export class TConnectEvmProvider extends TypedEvent {
    constructor(options) {
        super();
        this.appName = options.appName;
        this.appUrl = options.appUrl;
        this.appIcon = options.appIcon;
        this.bridgeUrl = options.bridgeUrl;
        this.walletApp = options?.walletApp;
        this._apiKey = options.apiKey;
        this._communicationController = new CommunicationController(this.bridgeUrl, SOCKET_IO_PATH, REQUEST_CHANNEL, EVENT_CHANNEL);
    }
    async connect() {
        if (this._communicationController.connected()) {
            await this.disconnect();
        }
        await this._communicationController.connect();
        const connectionStringEventHandler = async (event) => {
            try {
                const validatedEvent = validateEvmEvent(event);
                if (validatedEvent.type === 'connectionString') {
                    this._communicationController.off('event', connectionStringEventHandler);
                    const { connectionString } = validatedEvent.payload;
                    this._connectionString = connectionString;
                    if (this.walletApp) {
                        if (isAndroid()) {
                            WebApp.openLink(getConnectionStringUniversalLink(this.walletApp, connectionString), {
                                try_instant_view: true,
                            });
                            await sleep(1000);
                            WebApp.openLink(getConnectionStringUniversalLink(this.walletApp, connectionString), {
                                try_instant_view: true,
                            });
                        }
                        else {
                            WebApp.openLink(getConnectionStringUniversalLink(this.walletApp, connectionString));
                        }
                    }
                    this.emit('connectionString', connectionString);
                }
            }
            catch (error) {
                console.error(error);
            }
        };
        this._communicationController.on('event', connectionStringEventHandler);
        this._communicationController.on('event', this._createEvmEventHandler());
        const { payload: { sessionId }, } = await this._sendEvmRequest({
            type: 'connect',
            payload: { apiKey: this._apiKey, appName: this.appName, appUrl: this.appUrl, appIcon: this.appIcon },
        });
        this._sessionId = sessionId;
    }
    async connected() {
        if (!this._sessionId || !this._communicationController.connected()) {
            return false;
        }
        const response = await this._sendEvmRequest({
            type: 'connected',
            sessionId: this._getSessionId(),
        });
        return response.payload.connected;
    }
    async request(args) {
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
        const response = await this._sendEvmRequest({ type: 'request', sessionId: this._getSessionId(), payload: args });
        return response.payload;
    }
    async disconnect() {
        try {
            await this._communicationController.send({ type: 'disconnect', sessionId: this._getSessionId() });
        }
        finally {
            this.emit('disconnect', new ProviderRpcError('Disconnected', 4900));
            this._communicationController.disconnect();
        }
    }
    serialize() {
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
        });
    }
    static async deserialize(json) {
        const data = parse(json);
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
    async _reconnect() {
        this._communicationController.on('event', this._createEvmEventHandler());
        await this._communicationController.connect();
        await this._sendEvmRequest({ type: 'reconnect', sessionId: this._getSessionId() });
    }
    _createEvmEventHandler() {
        return (event) => {
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
            }
            catch (error) {
                console.error(error);
            }
        };
    }
    async _sendEvmRequest(evmRequest) {
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
            }
            else {
                throw new EvmError(validatedEvmResponse.payload.type, getErrorMessage(validatedEvmResponse.payload.type, validatedEvmResponse.payload.message));
            }
        }
        if (evmRequest.type !== validatedEvmResponse.type) {
            throw new Error('Response type is different from request type');
        }
        return evmResponse;
    }
    _getSessionId() {
        if (!this._sessionId) {
            throw new Error('Session ID is not set');
        }
        return this._sessionId;
    }
    _getConnectionString() {
        if (!this._connectionString) {
            throw new Error('Connection string is not set');
        }
        return this._connectionString;
    }
}
//# sourceMappingURL=TConnectEvmProvider.js.map