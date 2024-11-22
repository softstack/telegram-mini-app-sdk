"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TConnectTezosBeaconProvider = void 0;
const blake2b_1 = require("@stablelib/blake2b");
const ed25519_1 = require("@stablelib/ed25519");
const utf8_1 = require("@stablelib/utf8");
const core_1 = require("@tconnect.io/core");
const dapp_communication_1 = require("@tconnect.io/dapp-communication");
const dapp_utils_1 = require("@tconnect.io/dapp-utils");
const tezos_beacon_api_types_1 = require("@tconnect.io/tezos-beacon-api-types");
const sdk_1 = __importDefault(require("@twa-dev/sdk"));
const bs58check_1 = __importDefault(require("bs58check"));
const constants_1 = require("./constants");
const base_1 = require("./utils/base");
const utils_1 = require("./utils/utils");
const validation_1 = require("./validation");
class TConnectTezosBeaconProvider extends core_1.TypedEvent {
    constructor(options) {
        super();
        this._permissionRequestCallbacks = new core_1.CallbackController(1000 * 60 * 60);
        this._operationRequestCallbacks = new core_1.CallbackController(1000 * 60 * 60);
        this._signPayloadRequestCallbacks = new core_1.CallbackController(1000 * 60 * 60);
        this.appName = options.appName;
        this.appUrl = options.appUrl;
        this._secretSeed = options.secretSeed;
        this._apiKey = options.apiKey;
        this._genericWalletUrl = options.genericWalletUrl ?? constants_1.GENERIC_WALLET_URL;
        this.network = options.network ?? { type: 'mainnet' };
        this.bridgeUrl = options.bridgeUrl;
        this.walletApp = options.walletApp;
        this._communicationKeyPair = (0, ed25519_1.generateKeyPairFromSeed)((0, blake2b_1.hash)((0, utf8_1.encode)(this._secretSeed), 32));
        this._communicationController = new dapp_communication_1.CommunicationController(this.bridgeUrl, tezos_beacon_api_types_1.SOCKET_IO_PATH, tezos_beacon_api_types_1.REQUEST_CHANNEL, tezos_beacon_api_types_1.EVENT_CHANNEL);
    }
    async permissionRequest() {
        await this._communicationController.connect();
        const initResponse = await this._sendTezosBeaconRequest({
            type: 'init',
            payload: {
                apiKey: this._apiKey,
                appName: this.appName,
                appUrl: this.appUrl,
                publicKey: Buffer.from(this._communicationKeyPair.publicKey).toString('hex'),
            },
        });
        this._sessionId = initResponse.payload.sessionId;
        const rawSignature = Buffer.from((0, ed25519_1.sign)(this._communicationKeyPair.secretKey, Buffer.from(initResponse.payload.loginRawDigest, 'hex'))).toString('hex');
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
            sdk_1.default.openLink((0, utils_1.getConnectionStringUniversalLink)(this.walletApp, loginResponse.payload.connectionString, this._genericWalletUrl));
        }
        this.emit('connectionString', loginResponse.payload.connectionString);
        return callbackPromise;
    }
    async getPKH() {
        return (0, utils_1.getAddressFromPublicKey)(this._getPublicKey());
    }
    async getPK() {
        return this._getPublicKey();
    }
    async mapTransferParamsToWalletParams(params) {
        const transferParameters = await params();
        console.log('mapTransferParamsToWalletParams()', transferParameters);
        return {
            amount: (0, base_1.formatTransactionAmount)(transferParameters.amount, transferParameters.mutez),
            destination: transferParameters.to,
            fee: transferParameters.fee === undefined ? undefined : (0, base_1.toIntegerString)(transferParameters.fee),
            gas_limit: transferParameters.gasLimit === undefined ? undefined : (0, base_1.toIntegerString)(transferParameters.gasLimit),
            kind: 'transaction',
            parameters: transferParameters.parameter,
            source: this._publicKey === undefined ? undefined : (0, utils_1.getAddressFromPublicKey)(this._publicKey),
            storage_limit: transferParameters.storageLimit === undefined ? undefined : (0, base_1.toIntegerString)(transferParameters.storageLimit),
        };
    }
    async mapTransferTicketParamsToWalletParams(params) {
        const transferTicketParameters = await params();
        console.log('mapTransferTicketParamsToWalletParams()', transferTicketParameters);
        throw new Error('mapTransferTicketParamsToWalletParams not implemented yet');
    }
    async mapStakeParamsToWalletParams(params) {
        const stakeParameters = await params();
        console.log('mapStakeParamsToWalletParams()', stakeParameters);
        return {
            amount: (0, base_1.formatTransactionAmount)(stakeParameters.amount, stakeParameters.mutez),
            destination: stakeParameters.to ?? (0, utils_1.getAddressFromPublicKey)(this._getPublicKey()),
            fee: stakeParameters.fee === undefined ? undefined : (0, base_1.toIntegerString)(stakeParameters.fee),
            gas_limit: stakeParameters.gasLimit === undefined ? undefined : (0, base_1.toIntegerString)(stakeParameters.gasLimit),
            kind: 'transaction',
            parameters: stakeParameters.parameter,
            source: this._publicKey === undefined ? undefined : (0, utils_1.getAddressFromPublicKey)(this._publicKey),
            storage_limit: stakeParameters.storageLimit === undefined ? undefined : (0, base_1.toIntegerString)(stakeParameters.storageLimit),
        };
    }
    async mapUnstakeParamsToWalletParams(params) {
        const unstakeParameters = await params();
        console.log('mapUnstakeParamsToWalletParams()', unstakeParameters);
        return {
            amount: (0, base_1.formatTransactionAmount)(unstakeParameters.amount, unstakeParameters.mutez),
            destination: unstakeParameters.to ?? (0, utils_1.getAddressFromPublicKey)(this._getPublicKey()),
            fee: unstakeParameters.fee === undefined ? undefined : (0, base_1.toIntegerString)(unstakeParameters.fee),
            gas_limit: unstakeParameters.gasLimit === undefined ? undefined : (0, base_1.toIntegerString)(unstakeParameters.gasLimit),
            kind: 'transaction',
            parameters: unstakeParameters.parameter,
            source: this._publicKey === undefined ? undefined : (0, utils_1.getAddressFromPublicKey)(this._publicKey),
            storage_limit: unstakeParameters.storageLimit === undefined ? undefined : (0, base_1.toIntegerString)(unstakeParameters.storageLimit),
        };
    }
    async mapFinalizeUnstakeParamsToWalletParams(params) {
        const finalizeUnstakeParameters = await params();
        console.log('mapFinalizeUnstakeParamsToWalletParams()', finalizeUnstakeParameters);
        if (finalizeUnstakeParameters.amount === undefined) {
            throw new Error('Amount is required');
        }
        return {
            amount: (0, base_1.formatTransactionAmount)(finalizeUnstakeParameters.amount, finalizeUnstakeParameters.mutez),
            destination: finalizeUnstakeParameters.to ?? (0, utils_1.getAddressFromPublicKey)(this._getPublicKey()),
            fee: finalizeUnstakeParameters.fee === undefined ? undefined : (0, base_1.toIntegerString)(finalizeUnstakeParameters.fee),
            gas_limit: finalizeUnstakeParameters.gasLimit === undefined
                ? undefined
                : (0, base_1.toIntegerString)(finalizeUnstakeParameters.gasLimit),
            kind: 'transaction',
            parameters: finalizeUnstakeParameters.parameter,
            source: this._publicKey === undefined ? undefined : (0, utils_1.getAddressFromPublicKey)(this._publicKey),
            storage_limit: finalizeUnstakeParameters.storageLimit === undefined
                ? undefined
                : (0, base_1.toIntegerString)(finalizeUnstakeParameters.storageLimit),
        };
    }
    async mapOriginateParamsToWalletParams(params) {
        const originateParameters = await params();
        console.log('mapOriginateParamsToWalletParams()', originateParameters);
        throw new Error('mapOriginateParamsToWalletParams not implemented yet');
    }
    async mapDelegateParamsToWalletParams(params) {
        const delegateParameters = await params();
        console.log('mapDelegateParamsToWalletParams()', delegateParameters);
        return {
            delegate: delegateParameters.delegate,
            fee: delegateParameters.fee === undefined ? undefined : (0, base_1.toIntegerString)(delegateParameters.fee),
            gas_limit: delegateParameters.gasLimit === undefined ? undefined : (0, base_1.toIntegerString)(delegateParameters.gasLimit),
            kind: 'delegation',
            storage_limit: delegateParameters.storageLimit === undefined ? undefined : (0, base_1.toIntegerString)(delegateParameters.storageLimit),
        };
    }
    async mapIncreasePaidStorageWalletParams(params) {
        const increasePaidStorageParameters = await params();
        console.log('mapIncreasePaidStorageWalletParams()', increasePaidStorageParameters);
        return {
            amount: (0, base_1.formatTransactionAmount)(increasePaidStorageParameters.amount, true),
            destination: increasePaidStorageParameters.destination,
            fee: increasePaidStorageParameters.fee === undefined
                ? undefined
                : (0, base_1.toIntegerString)(increasePaidStorageParameters.fee),
            gas_limit: increasePaidStorageParameters.gasLimit === undefined
                ? undefined
                : (0, base_1.toIntegerString)(increasePaidStorageParameters.gasLimit),
            kind: 'increase_paid_storage',
            storage_limit: increasePaidStorageParameters.storageLimit === undefined
                ? undefined
                : (0, base_1.toIntegerString)(increasePaidStorageParameters.storageLimit),
        };
    }
    async sendOperations(params) {
        console.log('sendOperations()', params);
        const response = await this._sendTezosMessage({
            type: 'operation_request',
            network: this.network,
            operationDetails: params,
            sourceAddress: (0, utils_1.getAddressFromPublicKey)(this._getPublicKey()),
        });
        return response.transactionHash;
    }
    async sign(bytes, watermark) {
        console.log('sign()', bytes, watermark);
        if (watermark?.length !== 1 || watermark[0] !== 3) {
            throw new Error('Watermark is not supported');
        }
        const bytesBuffer = Buffer.concat([Buffer.from(watermark), Buffer.from(bytes, 'hex')]);
        const watermarkedBytes = bytesBuffer.toString('hex');
        const response = await this._sendTezosMessage({
            type: 'sign_payload_request',
            payload: watermarkedBytes,
            sourceAddress: (0, utils_1.getAddressFromPublicKey)(this._getPublicKey()),
            signingType: 'operation',
        });
        return response.signature;
    }
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
        const response = await this._sendTezosMessage({
            type: 'sign_payload_request',
            payload,
            sourceAddress: sourceAddress ?? (0, utils_1.getAddressFromPublicKey)(this._getPublicKey()),
            signingType: signingType ?? 'raw',
        });
        return response;
    }
    connected() {
        return this._communicationController.connected();
    }
    async disconnect() {
        try {
            await this._sendTezosMessage({ type: 'disconnect' });
        }
        finally {
            this.emit('disconnect', undefined);
            this._communicationController.disconnect();
        }
    }
    serialize() {
        return (0, core_1.stringify)({
            appName: this.appName,
            appUrl: this.appUrl,
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
        });
    }
    static async deserialize(serialized) {
        const data = (0, core_1.parse)(serialized);
        const provider = new TConnectTezosBeaconProvider({
            appName: data.appName,
            appUrl: data.appUrl,
            secretSeed: data._secretSeed,
            apiKey: data._apiKey,
            network: data.network,
            bridgeUrl: data.bridgeUrl,
            walletApp: data.walletApp,
            genericWalletUrl: data._genericWalletUrl,
        });
        provider._communicationController = dapp_communication_1.CommunicationController.deserialize(data._communicationController);
        provider._sessionId = data._sessionId;
        provider._otherPublicKey = data._otherPublicKey;
        provider._publicKey = data._publicKey;
        await provider._reconnect();
        return provider;
    }
    async _reconnect() {
        this._communicationController.on('event', this._createTezosEventHandler(undefined));
        await this._communicationController.connect();
        await this._sendTezosBeaconRequest({ type: 'reconnect', sessionId: this._getSessionId() });
    }
    _createTezosEventHandler(permissionRequestId) {
        return async (event) => {
            try {
                event = (0, validation_1.validateTezosBeaconEvent)(event);
                switch (event.type) {
                    case 'message': {
                        const bodySplits = event.payload.message.split(':');
                        if (bodySplits.length > 1) {
                            if (permissionRequestId) {
                                const encryptedJson = bodySplits.at(-1);
                                if (!encryptedJson) {
                                    throw new Error('Empty text message');
                                }
                                const peerInfo = JSON.parse((0, utils_1.openCryptobox)(Buffer.from(encryptedJson, 'hex'), this._communicationKeyPair.publicKey, this._communicationKeyPair.secretKey));
                                if ((0, validation_1.isPeerInfo)(peerInfo)) {
                                    this._otherPublicKey = Buffer.from(peerInfo.publicKey, 'hex');
                                    const message = {
                                        id: permissionRequestId,
                                        type: 'permission_request',
                                        version: '2',
                                        senderId: (0, utils_1.getSenderId)((0, utils_1.toHex)(this._communicationKeyPair.publicKey)),
                                        appMetadata: {
                                            senderId: (0, utils_1.getSenderId)((0, utils_1.toHex)(this._communicationKeyPair.publicKey)),
                                            name: this.appName,
                                        },
                                        network: this.network,
                                        scopes: ['operation_request', 'sign'],
                                    };
                                    await this._sendTezosMessage(message);
                                }
                                else {
                                    console.log("PeerInfo isn't valid", peerInfo);
                                }
                            }
                        }
                        else if (this._otherPublicKey) {
                            const sharedKey = (0, utils_1.createCryptoBoxServer)(this._getOtherPublicKey().toString('hex'), this._communicationKeyPair);
                            const decryptedMessage = (0, utils_1.decryptCryptoboxPayload)(Buffer.from(event.payload.message, 'hex'), sharedKey.receive);
                            const message = JSON.parse(Buffer.from(bs58check_1.default.decode(decryptedMessage)).toString('utf8'));
                            if ((0, validation_1.isPermissionResponse)(message)) {
                                console.log('PermissionResponse', message);
                                this._publicKey = message.publicKey;
                                this._permissionRequestCallbacks.resolveCallback(message.id, undefined);
                            }
                            else if ((0, validation_1.isOperationResponse)(message)) {
                                console.log('OperationResponse', message);
                                this._operationRequestCallbacks.resolveCallback(message.id, message);
                            }
                            else if ((0, validation_1.isSignPayloadResponse)(message)) {
                                console.log('SignPayloadResponse', message);
                                this._signPayloadRequestCallbacks.resolveCallback(message.id, message);
                            }
                            else if ((0, validation_1.isDisconnectMessage)(message)) {
                                console.log('DisconnectMessage', message);
                                this.disconnect();
                            }
                            else if ((0, validation_1.isErrorResponse)(message)) {
                                console.error('ErrorResponse', message);
                                this._permissionRequestCallbacks.rejectCallback(message.id, new Error(message.errorType));
                                this._operationRequestCallbacks.rejectCallback(message.id, new Error(message.errorType));
                                this._signPayloadRequestCallbacks.rejectCallback(message.id, new Error(message.errorType));
                            }
                            else {
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
            }
            catch (error) {
                console.error(error);
            }
        };
    }
    async _sendTezosMessage(partialMessage) {
        const message = partialMessage.type === 'permission_request'
            ? {
                ...partialMessage,
                version: '2',
                senderId: (0, utils_1.getSenderId)((0, utils_1.toHex)(this._communicationKeyPair.publicKey)),
            }
            : {
                ...partialMessage,
                id: crypto.randomUUID(),
                version: '2',
                senderId: (0, utils_1.getSenderId)((0, utils_1.toHex)(this._communicationKeyPair.publicKey)),
            };
        const sharedKey = (0, utils_1.createCryptoBoxClient)(this._getOtherPublicKey().toString('hex'), this._communicationKeyPair);
        const encryptedMessage = (0, utils_1.encryptCryptoboxPayload)(bs58check_1.default.encode(Buffer.from(JSON.stringify(message), 'utf8')), sharedKey.send);
        if (this.walletApp) {
            switch (message.type) {
                case 'operation_request':
                case 'sign_payload_request': {
                    const universalLink = (0, utils_1.getUniversalLink)(this.walletApp);
                    if (universalLink) {
                        sdk_1.default.openLink(universalLink);
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
    async _sendTezosBeaconRequest(tezosRequest) {
        if (!this._communicationController.connected()) {
            throw new Error("Can't send request without connection");
        }
        const tezosResponse = await this._communicationController.send(tezosRequest);
        const validatedTezosResponse = (0, validation_1.validateTezosBeaconResponse)(tezosResponse);
        if (validatedTezosResponse.type === 'error') {
            if (validatedTezosResponse.payload.type === 'generic') {
                let errorMessage = `Error Code: ${validatedTezosResponse.payload.key}`;
                if (validatedTezosResponse.payload.message) {
                    errorMessage += `: ${validatedTezosResponse.payload.message}`;
                }
                throw new Error(errorMessage);
            }
            else {
                throw new tezos_beacon_api_types_1.TezosBeaconError(validatedTezosResponse.payload.type, (0, dapp_utils_1.getErrorMessage)(validatedTezosResponse.payload.type, validatedTezosResponse.payload.message));
            }
        }
        if (tezosRequest.type !== validatedTezosResponse.type) {
            throw new Error('Response type is different from request type');
        }
        return tezosResponse;
    }
    _getPublicKey() {
        if (!this._publicKey) {
            throw new Error('Public key is not set');
        }
        return this._publicKey;
    }
    _getSessionId() {
        if (!this._sessionId) {
            throw new Error('Session ID is not set');
        }
        return this._sessionId;
    }
    _getOtherPublicKey() {
        if (!this._otherPublicKey) {
            throw new Error('Wallet public key is not set');
        }
        return this._otherPublicKey;
    }
}
exports.TConnectTezosBeaconProvider = TConnectTezosBeaconProvider;
//# sourceMappingURL=TConnectTezosBeaconProvider.js.map