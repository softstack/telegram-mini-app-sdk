import { parse, sleep, stringify, TypedEvent } from '@tconnect.io/core';
import { CommunicationController } from '@tconnect.io/dapp-communication';
import { getErrorMessage, isAndroid, openLink } from '@tconnect.io/dapp-utils';
import { EtherlinkError, EVENT_CHANNEL, REQUEST_CHANNEL, SOCKET_IO_PATH, } from '@tconnect.io/etherlink-api-types';
import { ProviderRpcError } from './ProviderRpcError';
import { getConnectionStringUniversalLink, getUniversalLink } from './utils';
import { validateEtherlinkEvent, validateEtherlinkResponse } from './validation';
export class TConnectEtherlinkProvider extends TypedEvent {
    constructor(options) {
        super();
        this.appName = options.appName;
        this.appUrl = options.appUrl;
        this.appIcon = options.appIcon;
        this.bridgeUrl = options.bridgeUrl;
        this.walletApp = options?.walletApp;
        this.network = options.network;
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
                const validatedEvent = validateEtherlinkEvent(event);
                if (validatedEvent.type === 'connectionString') {
                    this._communicationController.off('event', connectionStringEventHandler);
                    const { connectionString } = validatedEvent.payload;
                    this._connectionString = connectionString;
                    if (this.walletApp) {
                        if (isAndroid()) {
                            openLink(getConnectionStringUniversalLink(this.walletApp, connectionString), {
                                try_instant_view: true,
                            });
                            await sleep(1000);
                            openLink(getConnectionStringUniversalLink(this.walletApp, connectionString), {
                                try_instant_view: true,
                            });
                        }
                        else {
                            openLink(getConnectionStringUniversalLink(this.walletApp, connectionString));
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
        this._communicationController.on('event', this._createEtherlinkEventHandler());
        const { payload: { sessionId }, } = await this._sendEtherlinkRequest({
            type: 'connect',
            payload: {
                apiKey: this._apiKey,
                appName: this.appName,
                appUrl: this.appUrl,
                appIcon: this.appIcon,
                network: this.network,
            },
        });
        this._sessionId = sessionId;
    }
    async connected() {
        if (!this._sessionId || !this._communicationController.connected()) {
            return false;
        }
        const response = await this._sendEtherlinkRequest({
            type: 'connected',
            sessionId: this._getSessionId(),
        });
        return response.payload.connected;
    }
    async request(args) {
        if (this.walletApp) {
            switch (args.method) {
                case 'eth_sendTransaction':
                case 'eth_sign':
                case 'eth_signTransaction':
                case 'eth_signTypedData':
                case 'eth_signTypedData_v3':
                case 'eth_signTypedData_v4':
                case 'personal_sign': {
                    openLink(getUniversalLink(this.walletApp));
                    break;
                }
            }
        }
        const response = await this._sendEtherlinkRequest({
            type: 'request',
            sessionId: this._getSessionId(),
            payload: args,
        });
        return response.payload;
    }
    async disconnect() {
        try {
            await this._communicationController.send({ type: 'disconnect', sessionId: this._getSessionId() });
        }
        finally {
            this.emit('disconnect', new ProviderRpcError('Disconnected', 4900));
            this._communicationController.disconnect();
            this._communicationController.removeAllListeners();
        }
    }
    serialize() {
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
        });
    }
    static async deserialize(json) {
        const data = parse(json);
        const provider = new TConnectEtherlinkProvider({
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
    async _reconnect() {
        this._communicationController.on('event', this._createEtherlinkEventHandler());
        await this._communicationController.connect();
        await this._sendEtherlinkRequest({ type: 'reconnect', sessionId: this._getSessionId() });
    }
    _createEtherlinkEventHandler() {
        return (event) => {
            try {
                const validatedEvent = validateEtherlinkEvent(event);
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
    async _sendEtherlinkRequest(etherlinkRequest) {
        if (!this._communicationController.connected()) {
            throw new Error("Can't send request without connection");
        }
        const etherlinkResponse = await this._communicationController.send(etherlinkRequest);
        const validatedEtherlinkResponse = validateEtherlinkResponse(etherlinkResponse);
        if (validatedEtherlinkResponse.type === 'error') {
            if (validatedEtherlinkResponse.payload.type === 'generic') {
                let errorMessage = `Error Code: ${validatedEtherlinkResponse.payload.key}`;
                if (validatedEtherlinkResponse.payload.message) {
                    errorMessage += `: ${validatedEtherlinkResponse.payload.message}`;
                }
                throw new Error(errorMessage);
            }
            else {
                throw new EtherlinkError(validatedEtherlinkResponse.payload.type, getErrorMessage(validatedEtherlinkResponse.payload.type, validatedEtherlinkResponse.payload.message));
            }
        }
        if (etherlinkRequest.type !== validatedEtherlinkResponse.type) {
            throw new Error('Response type is different from request type');
        }
        return etherlinkResponse;
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
//# sourceMappingURL=TConnectEtherlinkProvider.js.map