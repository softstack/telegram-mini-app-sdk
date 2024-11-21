export type EvmErrorType = 'generic' | 'invalidSessionId' | 'walletRequestFailed' | 'invalidApiKey';

// Start requests and responses

export interface EvmConnectRequest {
	type: 'connect';
	payload: {
		apiKey: string;
	};
}

export interface EvmConnectResponse {
	type: 'connect';
	payload: {
		sessionId: string;
		walletConnectUri: string;
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
	| EvmConnectEvent
	| EvmMessageEvent
	| EvmChainChangedEvent
	| EvmAccountsChangedEvent
	| EvmDisconnectEvent;

// End events
