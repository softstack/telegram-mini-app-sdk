import { hash } from '@stablelib/blake2b';
import { generateKeyPairFromSeed, sign } from '@stablelib/ed25519';
import { encode } from '@stablelib/utf8';
import { CallbackController, parse, stringify, TypedEvent } from '@tconnect.io/core';
import { CommunicationController } from '@tconnect.io/dapp-communication';
import { formatTransactionAmount, getErrorMessage, openLink, randomUUID, toIntegerString, } from '@tconnect.io/dapp-utils';
import { EVENT_CHANNEL, REQUEST_CHANNEL, SOCKET_IO_PATH, TezosBeaconError, } from '@tconnect.io/tezos-beacon-api-types';
import bs58check from 'bs58check';
import { createCryptoBoxClient, createCryptoBoxServer, decryptCryptoboxPayload, encryptCryptoboxPayload, getAddressFromPublicKey, getConnectionStringUniversalLink, getSenderId, getUniversalLink, openCryptobox, toHex, } from './utils/utils';
import { isDisconnectMessage, isErrorResponse, isOperationResponse, isPairingResponse, isPermissionResponse, isSignPayloadResponse, validateTezosBeaconEvent, validateTezosBeaconResponse, } from './validation';
export class TConnectTezosBeaconProvider extends TypedEvent {
    constructor(options) {
        super();
        this._permissionRequestCallbacks = new CallbackController(1000 * 60 * 60);
        this._operationRequestCallbacks = new CallbackController(1000 * 60 * 60);
        this._signPayloadRequestCallbacks = new CallbackController(1000 * 60 * 60);
        this.appName = options.appName;
        this.appUrl = options.appUrl;
        this.appIcon = options.appIcon;
        this._secretSeed = options.secretSeed;
        this._apiKey = options.apiKey;
        this.network = options.network ?? { type: 'mainnet' };
        this.bridgeUrl = options.bridgeUrl;
        this.walletApp = options.walletApp;
        this._communicationKeyPair = generateKeyPairFromSeed(hash(encode(this._secretSeed), 32));
        this._communicationController = new CommunicationController(this.bridgeUrl, SOCKET_IO_PATH, REQUEST_CHANNEL, EVENT_CHANNEL);
    }
    async permissionRequest() {
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
        const rawSignature = Buffer.from(sign(this._communicationKeyPair.secretKey, Buffer.from(initResponse.payload.loginRawDigest, 'hex'))).toString('hex');
        const loginResponse = await this._sendTezosBeaconRequest({
            type: 'login',
            sessionId: this._getSessionId(),
            payload: {
                rawSignature,
            },
        });
        const permissionRequestId = randomUUID();
        const callbackPromise = this._permissionRequestCallbacks.addCallback(permissionRequestId);
        this._communicationController.on('event', this._createTezosBeaconEventHandler(permissionRequestId));
        if (this.walletApp) {
            openLink(getConnectionStringUniversalLink(this.walletApp, loginResponse.payload.connectionString));
        }
        this.emit('connectionString', loginResponse.payload.connectionString);
        return callbackPromise;
    }
    async getPKH() {
        return getAddressFromPublicKey(this._getPublicKey());
    }
    async getPK() {
        return this._getPublicKey();
    }
    async mapTransferParamsToWalletParams(params) {
        const transferParameters = await params();
        console.log('mapTransferParamsToWalletParams()', transferParameters);
        return {
            kind: 'transaction',
            source: this._publicKey === undefined ? undefined : getAddressFromPublicKey(this._publicKey),
            destination: transferParameters.to,
            amount: formatTransactionAmount(transferParameters.amount, transferParameters.mutez),
            parameters: transferParameters.parameter,
            fee: transferParameters.fee === undefined ? undefined : toIntegerString(transferParameters.fee),
            gas_limit: transferParameters.gasLimit === undefined ? undefined : toIntegerString(transferParameters.gasLimit),
            storage_limit: transferParameters.storageLimit === undefined ? undefined : toIntegerString(transferParameters.storageLimit),
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
            amount: formatTransactionAmount(stakeParameters.amount, stakeParameters.mutez),
            destination: stakeParameters.to ?? getAddressFromPublicKey(this._getPublicKey()),
            fee: stakeParameters.fee === undefined ? undefined : toIntegerString(stakeParameters.fee),
            gas_limit: stakeParameters.gasLimit === undefined ? undefined : toIntegerString(stakeParameters.gasLimit),
            kind: 'transaction',
            parameters: stakeParameters.parameter,
            source: this._publicKey === undefined ? undefined : getAddressFromPublicKey(this._publicKey),
            storage_limit: stakeParameters.storageLimit === undefined ? undefined : toIntegerString(stakeParameters.storageLimit),
        };
    }
    async mapUnstakeParamsToWalletParams(params) {
        const unstakeParameters = await params();
        console.log('mapUnstakeParamsToWalletParams()', unstakeParameters);
        return {
            amount: formatTransactionAmount(unstakeParameters.amount, unstakeParameters.mutez),
            destination: unstakeParameters.to ?? getAddressFromPublicKey(this._getPublicKey()),
            fee: unstakeParameters.fee === undefined ? undefined : toIntegerString(unstakeParameters.fee),
            gas_limit: unstakeParameters.gasLimit === undefined ? undefined : toIntegerString(unstakeParameters.gasLimit),
            kind: 'transaction',
            parameters: unstakeParameters.parameter,
            source: this._publicKey === undefined ? undefined : getAddressFromPublicKey(this._publicKey),
            storage_limit: unstakeParameters.storageLimit === undefined ? undefined : toIntegerString(unstakeParameters.storageLimit),
        };
    }
    async mapFinalizeUnstakeParamsToWalletParams(params) {
        const finalizeUnstakeParameters = await params();
        console.log('mapFinalizeUnstakeParamsToWalletParams()', finalizeUnstakeParameters);
        if (finalizeUnstakeParameters.amount === undefined) {
            throw new Error('Amount is required');
        }
        return {
            amount: formatTransactionAmount(finalizeUnstakeParameters.amount, finalizeUnstakeParameters.mutez),
            destination: finalizeUnstakeParameters.to ?? getAddressFromPublicKey(this._getPublicKey()),
            fee: finalizeUnstakeParameters.fee === undefined ? undefined : toIntegerString(finalizeUnstakeParameters.fee),
            gas_limit: finalizeUnstakeParameters.gasLimit === undefined
                ? undefined
                : toIntegerString(finalizeUnstakeParameters.gasLimit),
            kind: 'transaction',
            parameters: finalizeUnstakeParameters.parameter,
            source: this._publicKey === undefined ? undefined : getAddressFromPublicKey(this._publicKey),
            storage_limit: finalizeUnstakeParameters.storageLimit === undefined
                ? undefined
                : toIntegerString(finalizeUnstakeParameters.storageLimit),
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
            fee: delegateParameters.fee === undefined ? undefined : toIntegerString(delegateParameters.fee),
            gas_limit: delegateParameters.gasLimit === undefined ? undefined : toIntegerString(delegateParameters.gasLimit),
            kind: 'delegation',
            storage_limit: delegateParameters.storageLimit === undefined ? undefined : toIntegerString(delegateParameters.storageLimit),
        };
    }
    async mapIncreasePaidStorageWalletParams(params) {
        const increasePaidStorageParameters = await params();
        console.log('mapIncreasePaidStorageWalletParams()', increasePaidStorageParameters);
        return {
            amount: formatTransactionAmount(increasePaidStorageParameters.amount, true),
            destination: increasePaidStorageParameters.destination,
            fee: increasePaidStorageParameters.fee === undefined
                ? undefined
                : toIntegerString(increasePaidStorageParameters.fee),
            gas_limit: increasePaidStorageParameters.gasLimit === undefined
                ? undefined
                : toIntegerString(increasePaidStorageParameters.gasLimit),
            kind: 'increase_paid_storage',
            storage_limit: increasePaidStorageParameters.storageLimit === undefined
                ? undefined
                : toIntegerString(increasePaidStorageParameters.storageLimit),
        };
    }
    async sendOperations(params) {
        console.log('sendOperations()', params);
        const response = await this._sendTezosMessage({
            type: 'operation_request',
            network: this.network,
            operationDetails: params,
            sourceAddress: getAddressFromPublicKey(this._getPublicKey()),
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
            sourceAddress: getAddressFromPublicKey(this._getPublicKey()),
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
            sourceAddress: sourceAddress ?? getAddressFromPublicKey(this._getPublicKey()),
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
        return stringify({
            appName: this.appName,
            appUrl: this.appUrl,
            appIcon: this.appIcon,
            network: this.network,
            bridgeUrl: this.bridgeUrl,
            walletApp: this.walletApp,
            _secretSeed: this._secretSeed,
            _apiKey: this._apiKey,
            _communicationController: this._communicationController.serialize(),
            _sessionId: this._getSessionId(),
            _otherPublicKey: this._getOtherPublicKey(),
            _publicKey: this._getPublicKey(),
        });
    }
    static async deserialize(serialized) {
        const data = parse(serialized);
        const provider = new TConnectTezosBeaconProvider({
            appName: data.appName,
            appUrl: data.appUrl,
            appIcon: data.appIcon,
            secretSeed: data._secretSeed,
            apiKey: data._apiKey,
            network: data.network,
            bridgeUrl: data.bridgeUrl,
            walletApp: data.walletApp,
        });
        provider._communicationController = CommunicationController.deserialize(data._communicationController);
        provider._sessionId = data._sessionId;
        provider._otherPublicKey = data._otherPublicKey;
        provider._publicKey = data._publicKey;
        await provider._reconnect();
        return provider;
    }
    async _reconnect() {
        this._communicationController.on('event', this._createTezosBeaconEventHandler(undefined));
        await this._communicationController.connect();
        await this._sendTezosBeaconRequest({ type: 'reconnect', sessionId: this._getSessionId() });
    }
    _createTezosBeaconEventHandler(permissionRequestId) {
        return async (event) => {
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
                                const pairingResponse = JSON.parse(openCryptobox(Buffer.from(encryptedJson, 'hex'), this._communicationKeyPair.publicKey, this._communicationKeyPair.secretKey));
                                if (isPairingResponse(pairingResponse)) {
                                    this._otherPublicKey = Buffer.from(pairingResponse.publicKey, 'hex');
                                    const message = {
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
                                }
                                else {
                                    console.log("pairingResponse isn't valid", pairingResponse);
                                }
                            }
                        }
                        else if (this._otherPublicKey) {
                            const sharedKey = createCryptoBoxServer(this._getOtherPublicKey().toString('hex'), this._communicationKeyPair);
                            const decryptedMessage = decryptCryptoboxPayload(Buffer.from(event.payload.message, 'hex'), sharedKey.receive);
                            const message = JSON.parse(Buffer.from(bs58check.decode(decryptedMessage)).toString('utf8'));
                            if (isPermissionResponse(message)) {
                                console.log('PermissionResponse', message);
                                this._publicKey = message.publicKey;
                                this._permissionRequestCallbacks.resolveCallback(message.id, undefined);
                            }
                            else if (isOperationResponse(message)) {
                                console.log('OperationResponse', message);
                                this._operationRequestCallbacks.resolveCallback(message.id, message);
                            }
                            else if (isSignPayloadResponse(message)) {
                                console.log('SignPayloadResponse', message);
                                this._signPayloadRequestCallbacks.resolveCallback(message.id, message);
                            }
                            else if (isDisconnectMessage(message)) {
                                console.log('DisconnectMessage', message);
                                this.disconnect();
                            }
                            else if (isErrorResponse(message)) {
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
                senderId: getSenderId(toHex(this._communicationKeyPair.publicKey)),
            }
            : {
                ...partialMessage,
                id: randomUUID(),
                version: '2',
                senderId: getSenderId(toHex(this._communicationKeyPair.publicKey)),
            };
        const sharedKey = createCryptoBoxClient(this._getOtherPublicKey().toString('hex'), this._communicationKeyPair);
        const encryptedMessage = encryptCryptoboxPayload(bs58check.encode(Buffer.from(JSON.stringify(message), 'utf8')), sharedKey.send);
        if (this.walletApp) {
            switch (message.type) {
                case 'operation_request':
                case 'sign_payload_request': {
                    const universalLink = getUniversalLink(this.walletApp);
                    if (universalLink) {
                        openLink(universalLink);
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
        const validatedTezosResponse = validateTezosBeaconResponse(tezosResponse);
        if (validatedTezosResponse.type === 'error') {
            if (validatedTezosResponse.payload.type === 'generic') {
                let errorMessage = `Error Code: ${validatedTezosResponse.payload.key}`;
                if (validatedTezosResponse.payload.message) {
                    errorMessage += `: ${validatedTezosResponse.payload.message}`;
                }
                throw new Error(errorMessage);
            }
            else {
                throw new TezosBeaconError(validatedTezosResponse.payload.type, getErrorMessage(validatedTezosResponse.payload.type, validatedTezosResponse.payload.message));
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
//# sourceMappingURL=TConnectTezosBeaconProvider.js.map