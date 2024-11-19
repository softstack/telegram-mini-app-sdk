export type TezosBeaconErrorType = 'generic' | 'invalidSessionId' | 'invalidApiKey';

// Start requests and responses

export interface TezosBeaconInitRequest {
	type: 'init';
	payload: {
		apiKey: string;
		appName: string;
		appUrl: string;
		publicKey: string;
	};
}

export interface TezosBeaconInitResponse {
	type: 'init';
	payload: {
		sessionId: string;
		loginRawDigest: string;
	};
}

export interface TezosBeaconLoginRequest {
	type: 'login';
	sessionId: string;
	payload: {
		rawSignature: string;
	};
}

export interface TezosBeaconLoginResponse {
	type: 'login';
	payload: {
		connectionString: string;
	};
}

export interface TezosBeaconMessageRequest {
	type: 'message';
	sessionId: string;
	payload: {
		message: string;
	};
}

export interface TezosBeaconMessageResponse {
	type: 'message';
}

export interface TezosBeaconReconnectRequest {
	type: 'reconnect';
	sessionId: string;
}

export interface TezosBeaconReconnectResponse {
	type: 'reconnect';
}

export interface TezosBeaconDisconnectRequest {
	type: 'disconnect';
	sessionId: string;
	payload: {
		message: string;
	};
}

export interface TezosBeaconDisconnectResponse {
	type: 'disconnect';
}

export interface TezosBeaconErrorResponse {
	type: 'error';
	payload:
		| {
				type: Extract<TezosBeaconErrorType, 'generic'>;
				key: string;
				message?: string;
		  }
		| {
				type: Exclude<TezosBeaconErrorType, 'generic'>;
				message?: string;
		  };
}

export type TezosBeaconRequest =
	| TezosBeaconInitRequest
	| TezosBeaconLoginRequest
	| TezosBeaconMessageRequest
	| TezosBeaconReconnectRequest
	| TezosBeaconDisconnectRequest;

export type TezosBeaconResponse =
	| TezosBeaconInitResponse
	| TezosBeaconLoginResponse
	| TezosBeaconMessageResponse
	| TezosBeaconReconnectResponse
	| TezosBeaconDisconnectResponse;

// End requests and responses

// Start events

export interface MessageEvent {
	type: 'message';
	payload: {
		message: string;
	};
}

export interface DisconnectEvent {
	type: 'disconnect';
}

export type TezosBeaconEvent = MessageEvent | DisconnectEvent;

// End events
