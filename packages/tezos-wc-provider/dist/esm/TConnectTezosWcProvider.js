import { isAndroid, getErrorMessage } from '@tconnect.io/dapp-utils';
import { CallbackController, parse, sleep, stringify, TypedEvent } from '@tconnect.io/core';
import { CommunicationController } from '@tconnect.io/dapp-communication';
import { EVENT_CHANNEL, REQUEST_CHANNEL, SOCKET_IO_PATH, TezosWcError, } from '@tconnect.io/tezos-wc-api-types';
import WebApp from '@twa-dev/sdk';
import { getUniversalLink, getWalletConnectUniversalLink } from './utils/utils';
import { isGetAccountsResult, isSendResult, isSignResult, validateTezosWcEvent, validateTezosWcResponse, } from './validation';
export class TConnectTezosWcProvider extends TypedEvent {
    constructor(options) {
        super();
        this._permissionRequestCallbacks = new CallbackController(1000 * 60 * 60);
        this._apiKey = options.apiKey;
        this.bridgeUrl = options.bridgeUrl;
        this.walletApp = options.walletApp;
        this.network = options.network ?? 'mainnet';
        this._communicationController = new CommunicationController(this.bridgeUrl, SOCKET_IO_PATH, REQUEST_CHANNEL, EVENT_CHANNEL);
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
            if (isAndroid()) {
                WebApp.openLink(getWalletConnectUniversalLink(this.walletApp, walletConnectUri), { try_instant_view: true });
                await sleep(1000);
                WebApp.openLink(getWalletConnectUniversalLink(this.walletApp, walletConnectUri), { try_instant_view: true });
            }
            else {
                WebApp.openLink(getWalletConnectUniversalLink(this.walletApp, walletConnectUri));
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
        return stringify({
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
        const data = parse(serialized);
        const provider = new TConnectTezosWcProvider({
            bridgeUrl: data.bridgeUrl,
            apiKey: data._apiKey,
            walletApp: data.walletApp,
            network: data.network,
        });
        provider._communicationController = CommunicationController.deserialize(data._communicationController);
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
        if (!isSendResult(response.payload)) {
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
        if (!isSignResult(response.payload)) {
            throw new Error('Invalid response');
        }
        return response.payload.signature;
    }
    _createTezosWcEventHandler() {
        return (event) => {
            try {
                const validatedEvent = validateTezosWcEvent(event);
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
        if (!isGetAccountsResult(response.payload)) {
            throw new Error('Invalid tezos_getAccounts response');
        }
        return response.payload[0];
    }
    async _sendTezosWcRequest(tezosRequest) {
        if (!this._communicationController.connected()) {
            throw new Error("Can't send request without connection");
        }
        if (this.walletApp && tezosRequest.type === 'request') {
            switch (tezosRequest.payload.method) {
                case 'tezos_send':
                case 'tezos_sign': {
                    WebApp.openLink(getUniversalLink(this.walletApp));
                    break;
                }
            }
        }
        const tezosResponse = await this._communicationController.send(tezosRequest);
        const validatedTezosResponse = validateTezosWcResponse(tezosResponse);
        if (validatedTezosResponse.type === 'error') {
            if (validatedTezosResponse.payload.type === 'generic') {
                let errorMessage = `Error Code: ${validatedTezosResponse.payload.key}`;
                if (validatedTezosResponse.payload.message) {
                    errorMessage += `: ${validatedTezosResponse.payload.message}`;
                }
                throw new Error(errorMessage);
            }
            else {
                throw new TezosWcError(validatedTezosResponse.payload.type, getErrorMessage(validatedTezosResponse.payload.type, validatedTezosResponse.payload.message));
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
//# sourceMappingURL=TConnectTezosWcProvider.js.map