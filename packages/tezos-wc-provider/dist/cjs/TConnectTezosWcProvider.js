"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TConnectTezosWcProvider = void 0;
const dapp_utils_1 = require("@tconnect.io/dapp-utils");
const core_1 = require("@tconnect.io/core");
const dapp_communication_1 = require("@tconnect.io/dapp-communication");
const tezos_wc_api_types_1 = require("@tconnect.io/tezos-wc-api-types");
const sdk_1 = __importDefault(require("@twa-dev/sdk"));
const utils_1 = require("./utils/utils");
const validation_1 = require("./validation");
class TConnectTezosWcProvider extends core_1.TypedEvent {
    constructor(options) {
        super();
        this._permissionRequestCallbacks = new core_1.CallbackController(1000 * 60 * 60);
        this._apiKey = options.apiKey;
        this.bridgeUrl = options.bridgeUrl;
        this.walletApp = options.walletApp;
        this.network = options.network ?? 'mainnet';
        this._communicationController = new dapp_communication_1.CommunicationController(this.bridgeUrl, tezos_wc_api_types_1.SOCKET_IO_PATH, tezos_wc_api_types_1.REQUEST_CHANNEL, tezos_wc_api_types_1.EVENT_CHANNEL);
    }
    async permissionRequest() {
        if (this._communicationController.connected()) {
            await this.disconnect();
        }
        await this._communicationController.connect();
        this._communicationController.on('event', this._createTezosWcEventHandler());
        const { payload: { sessionId, walletConnectUri }, } = await this._sendTezosWcRequest({
            type: 'connect',
            payload: { apiKey: this._apiKey, network: this.network },
        });
        this._sessionId = sessionId;
        this._walletConnectUri = walletConnectUri;
        const callbackPromise = this._permissionRequestCallbacks.addCallback(sessionId);
        if (this.walletApp) {
            // Android needs a second reminder to open the link
            if ((0, dapp_utils_1.isAndroid)()) {
                sdk_1.default.openLink((0, utils_1.getWalletConnectUniversalLink)(this.walletApp, walletConnectUri), { try_instant_view: true });
                await (0, core_1.sleep)(1000);
                sdk_1.default.openLink((0, utils_1.getWalletConnectUniversalLink)(this.walletApp, walletConnectUri), { try_instant_view: true });
            }
            else {
                sdk_1.default.openLink((0, utils_1.getWalletConnectUniversalLink)(this.walletApp, walletConnectUri));
            }
        }
        this.emit('connectionString', walletConnectUri);
        return callbackPromise;
    }
    async connected() {
        if (!this._sessionId || !this._communicationController.connected()) {
            return false;
        }
        const response = await this._sendTezosWcRequest({
            type: 'connected',
            sessionId: this._getSessionId(),
        });
        return response.payload.connected;
    }
    async disconnect() {
        try {
            await this._sendTezosWcRequest({ type: 'disconnect', sessionId: this._getSessionId() });
        }
        finally {
            this.emit('disconnect', undefined);
            this._communicationController.disconnect();
        }
    }
    serialize() {
        return (0, core_1.stringify)({
            bridgeUrl: this.bridgeUrl,
            walletApp: this.walletApp,
            network: this.network,
            _apiKey: this._apiKey,
            _communicationController: this._communicationController.serialize(),
            _sessionId: this._getSessionId(),
            _walletConnectUri: this._getWalletConnectUri(),
        });
    }
    static async deserialize(serialized) {
        const data = (0, core_1.parse)(serialized);
        const provider = new TConnectTezosWcProvider({
            bridgeUrl: data.bridgeUrl,
            apiKey: data._apiKey,
            walletApp: data.walletApp,
            network: data.network,
        });
        provider._communicationController = dapp_communication_1.CommunicationController.deserialize(data._communicationController);
        provider._sessionId = data._sessionId;
        provider._walletConnectUri = data._walletConnectUri;
        await provider._reconnect();
        return provider;
    }
    async _reconnect() {
        this._communicationController.on('event', this._createTezosWcEventHandler());
        await this._communicationController.connect();
        await this._sendTezosWcRequest({ type: 'reconnect', sessionId: this._getSessionId() });
    }
    // Start WalletProvider
    async getPKH() {
        const accounts = await this._getAccounts();
        return accounts.address;
    }
    async getPK() {
        const accounts = await this._getAccounts();
        return accounts.pubkey;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async mapTransferParamsToWalletParams(params) {
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
    mapTransferTicketParamsToWalletParams(params) {
        throw new Error('mapTransferTicketParamsToWalletParams not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    mapStakeParamsToWalletParams(params) {
        throw new Error('mapStakeParamsToWalletParams not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    mapUnstakeParamsToWalletParams(params) {
        throw new Error('mapUnstakeParamsToWalletParams not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    mapFinalizeUnstakeParamsToWalletParams(params) {
        throw new Error('mapFinalizeUnstakeParamsToWalletParams not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    mapOriginateParamsToWalletParams(params) {
        throw new Error('mapOriginateParamsToWalletParams not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    mapDelegateParamsToWalletParams(params) {
        throw new Error('mapDelegateParamsToWalletParams not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    mapIncreasePaidStorageWalletParams(params) {
        throw new Error('mapIncreasePaidStorageWalletParams not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async sendOperations(params) {
        console.log('sendOperations()', params);
        const response = await this._sendTezosWcRequest({
            type: 'request',
            sessionId: this._getSessionId(),
            payload: {
                method: 'tezos_send',
                params: params[0],
            },
        });
        if (!(0, validation_1.isSendResult)(response.payload)) {
            throw new Error('Invalid tezos_send response');
        }
        return response.payload.operationHash;
    }
    async sign(bytes, watermark) {
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
    async requestSignPayload(input) {
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
        if (!(0, validation_1.isSignResult)(response.payload)) {
            throw new Error('Invalid response');
        }
        return response.payload.signature;
    }
    _createTezosWcEventHandler() {
        return (event) => {
            try {
                const validatedEvent = (0, validation_1.validateTezosWcEvent)(event);
                switch (validatedEvent.type) {
                    case 'connect': {
                        this._permissionRequestCallbacks.resolveCallback(validatedEvent.payload.sessionId);
                        break;
                    }
                    case 'disconnect': {
                        this.emit('disconnect', undefined);
                        break;
                    }
                }
            }
            catch (error) {
                console.error(error);
            }
        };
    }
    async _getAccounts() {
        const response = await this._sendTezosWcRequest({
            type: 'request',
            sessionId: this._getSessionId(),
            payload: { method: 'tezos_getAccounts', params: {} },
        });
        if (!(0, validation_1.isGetAccountsResult)(response.payload)) {
            throw new Error('Invalid tezos_getAccounts response');
        }
        return response.payload[0];
    }
    async _sendTezosWcRequest(tezosRequest) {
        if (!this._communicationController.connected()) {
            throw new Error("Can't send request without connection");
        }
        const tezosResponse = await this._communicationController.send(tezosRequest);
        const validatedTezosResponse = (0, validation_1.validateTezosWcResponse)(tezosResponse);
        if (validatedTezosResponse.type === 'error') {
            if (validatedTezosResponse.payload.type === 'generic') {
                let errorMessage = `Error Code: ${validatedTezosResponse.payload.key}`;
                if (validatedTezosResponse.payload.message) {
                    errorMessage += `: ${validatedTezosResponse.payload.message}`;
                }
                throw new Error(errorMessage);
            }
            else {
                throw new tezos_wc_api_types_1.TezosWcError(validatedTezosResponse.payload.type, validatedTezosResponse.payload.message);
            }
        }
        if (tezosRequest.type !== validatedTezosResponse.type) {
            throw new Error('Response type is different from request type');
        }
        return tezosResponse;
    }
    _getSessionId() {
        if (!this._sessionId) {
            throw new Error('Session ID is not set');
        }
        return this._sessionId;
    }
    _getWalletConnectUri() {
        if (!this._walletConnectUri) {
            throw new Error('WalletConnect URI is not set');
        }
        return this._walletConnectUri;
    }
}
exports.TConnectTezosWcProvider = TConnectTezosWcProvider;
//# sourceMappingURL=TConnectTezosWcProvider.js.map