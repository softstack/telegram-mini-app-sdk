import { parse, sleep, stringify, TypedEvent } from '@tconnect.io/core';
import { CommunicationController } from '@tconnect.io/dapp-communication';
import { formatTransactionAmount, getErrorMessage, isAndroid, openLink, toIntegerString, } from '@tconnect.io/dapp-utils';
import { EVENT_CHANNEL, REQUEST_CHANNEL, SOCKET_IO_PATH, TezosWcError, } from '@tconnect.io/tezos-wc-api-types';
import { getConnectionStringUniversalLink, getUniversalLink } from './utils/utils';
import { isGetAccountsResult, isSendResult, isSignResult, validateTezosWcEvent, validateTezosWcResponse, } from './validation';
export class TConnectTezosWcProvider extends TypedEvent {
    constructor(options) {
        super();
        this.appName = options.appName;
        this.appUrl = options.appUrl;
        this.appIcon = options.appIcon;
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
        const connectionStringEventHandler = async (event) => {
            try {
                const validatedEvent = validateTezosWcEvent(event);
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
        this._communicationController.on('event', this._createTezosWcEventHandler());
        const { payload: { sessionId }, } = await this._sendTezosWcRequest({
            type: 'connect',
            payload: {
                apiKey: this._apiKey,
                network: this.network,
                appName: this.appName,
                appUrl: this.appUrl,
                appIcon: this.appIcon,
            },
        });
        this._sessionId = sessionId;
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
        const provider = new TConnectTezosWcProvider({
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
        this._communicationController.on('event', this._createTezosWcEventHandler());
        await this._communicationController.connect();
        await this._sendTezosWcRequest({ type: 'reconnect', sessionId: this._getSessionId() });
    }
    async getPKH() {
        const accounts = await this._getAccounts();
        return accounts.address;
    }
    async getPK() {
        const accounts = await this._getAccounts();
        return accounts.pubkey;
    }
    async mapTransferParamsToWalletParams(params) {
        const transferParameters = await params();
        console.log('mapTransferParamsToWalletParams()', transferParameters);
        const address = await this.getPKH();
        return {
            account: address,
            operations: [
                {
                    kind: 'transaction',
                    source: address,
                    destination: transferParameters.to,
                    amount: formatTransactionAmount(transferParameters.amount, transferParameters.mutez),
                    parameters: transferParameters.parameter,
                    fee: transferParameters.fee === undefined ? undefined : toIntegerString(transferParameters.fee),
                    gas_limit: transferParameters.gasLimit === undefined ? undefined : toIntegerString(transferParameters.gasLimit),
                    storage_limit: transferParameters.storageLimit === undefined
                        ? undefined
                        : toIntegerString(transferParameters.storageLimit),
                },
            ],
        };
    }
    mapTransferTicketParamsToWalletParams(params) {
        throw new Error('mapTransferTicketParamsToWalletParams not implemented.');
    }
    mapStakeParamsToWalletParams(params) {
        throw new Error('mapStakeParamsToWalletParams not implemented.');
    }
    mapUnstakeParamsToWalletParams(params) {
        throw new Error('mapUnstakeParamsToWalletParams not implemented.');
    }
    mapFinalizeUnstakeParamsToWalletParams(params) {
        throw new Error('mapFinalizeUnstakeParamsToWalletParams not implemented.');
    }
    mapOriginateParamsToWalletParams(params) {
        throw new Error('mapOriginateParamsToWalletParams not implemented.');
    }
    mapDelegateParamsToWalletParams(params) {
        throw new Error('mapDelegateParamsToWalletParams not implemented.');
    }
    mapIncreasePaidStorageWalletParams(params) {
        throw new Error('mapIncreasePaidStorageWalletParams not implemented.');
    }
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
                    openLink(getUniversalLink(this.walletApp));
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
    _getConnectionString() {
        if (!this._connectionString) {
            throw new Error('Connection string is not set');
        }
        return this._connectionString;
    }
}
//# sourceMappingURL=TConnectTezosWcProvider.js.map