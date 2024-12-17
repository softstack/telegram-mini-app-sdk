/**
 * Represents the different types of errors that can occur in the EVM bridge API.
 *
 * @typedef {('generic' | 'invalidSessionId' | 'walletRequestFailed' | 'invalidApiKey')} EvmErrorType
 *
 * @property {'generic'} generic - A generic error type for unspecified errors.
 * @property {'invalidSessionId'} invalidSessionId - Error type indicating an invalid session ID.
 * @property {'walletRequestFailed'} walletRequestFailed - Error type indicating a failure in the wallet request.
 * @property {'invalidApiKey'} invalidApiKey - Error type indicating an invalid API key.
 */
export type EvmErrorType = 'generic' | 'invalidSessionId' | 'walletRequestFailed' | 'invalidApiKey';

export type EvmNetwork = 'mainnet' | 'ghostnet';

// Start requests and responses

export interface EvmConnectRequest {
	type: 'connect';
	payload: {
		apiKey: string;
		appName: string;
		appUrl: string;
		appIcon: string | undefined;
		network: EvmNetwork;
	};
}

export interface EvmConnectResponse {
	type: 'connect';
	payload: {
		sessionId: string;
	};
}

export interface EvmConnectedRequest {
	type: 'connected';
	sessionId: string;
}

export interface EvmConnectedResponse {
	type: 'connected';
	payload: { connected: boolean };
}

export interface EvmRequestRequest {
	type: 'request';
	sessionId: string;
	payload: unknown;
}

export interface EvmRequestResponse {
	type: 'request';
	payload: unknown;
}

export interface EvmReconnectRequest {
	type: 'reconnect';
	sessionId: string;
}

export interface EvmReconnectResponse {
	type: 'reconnect';
}

export interface EvmDisconnectRequest {
	type: 'disconnect';
	sessionId: string;
}

export interface EvmDisconnectResponse {
	type: 'disconnect';
}

export interface EvmErrorResponse {
	type: 'error';
	payload:
		| {
				type: Extract<EvmErrorType, 'generic'>;
				key: string;
				message?: string;
		  }
		| {
				type: Exclude<EvmErrorType, 'generic'>;
				message: string;
		  };
}

export type EvmRequest =
	| EvmConnectRequest
	| EvmConnectedRequest
	| EvmRequestRequest
	| EvmReconnectRequest
	| EvmDisconnectRequest;

export type EvmResponse =
	| EvmConnectResponse
	| EvmConnectedResponse
	| EvmRequestResponse
	| EvmReconnectResponse
	| EvmDisconnectResponse;

// End requests and responses

// Start events

export interface EvmConnectionStringEvent {
	type: 'connectionString';
	payload: {
		connectionString: string;
	};
}

export interface EvmConnectEvent {
	type: 'connect';
	payload: {
		chainId: string;
	};
}

export interface EvmMessageEvent {
	type: 'message';
	payload: {
		type: string;
		data: unknown;
	};
}

export interface EvmChainChangedEvent {
	type: 'chainChanged';
	payload: string; // ChainId
}

export interface EvmAccountsChangedEvent {
	type: 'accountsChanged';
	payload: string[]; // Accounts
}

export interface EvmDisconnectEvent {
	type: 'disconnect';
	payload: {
		message: string;
		code: number;
		data?: unknown;
	};
}

export type EvmEvent =
	| EvmConnectionStringEvent
	| EvmConnectEvent
	| EvmMessageEvent
	| EvmChainChangedEvent
	| EvmAccountsChangedEvent
	| EvmDisconnectEvent;

// End events
