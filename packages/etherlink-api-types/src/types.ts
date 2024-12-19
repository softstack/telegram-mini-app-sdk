/**
 * Represents the different types of errors that can occur in the Etherlink bridge API.
 *
 * @typedef {('generic' | 'invalidSessionId' | 'walletRequestFailed' | 'invalidApiKey')} EtherlinkErrorType
 *
 * @property {'generic'} generic - A generic error type for unspecified errors.
 * @property {'invalidSessionId'} invalidSessionId - Error type indicating an invalid session ID.
 * @property {'walletRequestFailed'} walletRequestFailed - Error type indicating a failure in the wallet request.
 * @property {'invalidApiKey'} invalidApiKey - Error type indicating an invalid API key.
 */
export type EtherlinkErrorType = 'generic' | 'invalidSessionId' | 'walletRequestFailed' | 'invalidApiKey';

export type EtherlinkNetwork = 'mainnet' | 'ghostnet';

// Start requests and responses

export interface EtherlinkConnectRequest {
	type: 'connect';
	payload: {
		apiKey: string;
		appName: string;
		appUrl: string;
		appIcon: string | undefined;
		network: EtherlinkNetwork;
	};
}

export interface EtherlinkConnectResponse {
	type: 'connect';
	payload: {
		sessionId: string;
	};
}

export interface EtherlinkConnectedRequest {
	type: 'connected';
	sessionId: string;
}

export interface EtherlinkConnectedResponse {
	type: 'connected';
	payload: { connected: boolean };
}

export interface EtherlinkRequestRequest {
	type: 'request';
	sessionId: string;
	payload: unknown;
}

export interface EtherlinkRequestResponse {
	type: 'request';
	payload: unknown;
}

export interface EtherlinkReconnectRequest {
	type: 'reconnect';
	sessionId: string;
}

export interface EtherlinkReconnectResponse {
	type: 'reconnect';
}

export interface EtherlinkDisconnectRequest {
	type: 'disconnect';
	sessionId: string;
}

export interface EtherlinkDisconnectResponse {
	type: 'disconnect';
}

export interface EtherlinkErrorResponse {
	type: 'error';
	payload:
		| {
				type: Extract<EtherlinkErrorType, 'generic'>;
				key: string;
				message?: string;
		  }
		| {
				type: Exclude<EtherlinkErrorType, 'generic'>;
				message: string;
		  };
}

export type EtherlinkRequest =
	| EtherlinkConnectRequest
	| EtherlinkConnectedRequest
	| EtherlinkRequestRequest
	| EtherlinkReconnectRequest
	| EtherlinkDisconnectRequest;

export type EtherlinkResponse =
	| EtherlinkConnectResponse
	| EtherlinkConnectedResponse
	| EtherlinkRequestResponse
	| EtherlinkReconnectResponse
	| EtherlinkDisconnectResponse;

// End requests and responses

// Start events

export interface EtherlinkConnectionStringEvent {
	type: 'connectionString';
	payload: {
		connectionString: string;
	};
}

export interface EtherlinkConnectEvent {
	type: 'connect';
	payload: {
		chainId: string;
	};
}

export interface EtherlinkMessageEvent {
	type: 'message';
	payload: {
		type: string;
		data: unknown;
	};
}

export interface EtherlinkChainChangedEvent {
	type: 'chainChanged';
	payload: string; // ChainId
}

export interface EtherlinkAccountsChangedEvent {
	type: 'accountsChanged';
	payload: string[]; // Accounts
}

export interface EtherlinkDisconnectEvent {
	type: 'disconnect';
	payload: {
		message: string;
		code: number;
		data?: unknown;
	};
}

export type EtherlinkEvent =
	| EtherlinkConnectionStringEvent
	| EtherlinkConnectEvent
	| EtherlinkMessageEvent
	| EtherlinkChainChangedEvent
	| EtherlinkAccountsChangedEvent
	| EtherlinkDisconnectEvent;

// End events
