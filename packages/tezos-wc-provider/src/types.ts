export type TezosWcWalletApp = 'kukai';

export type SigningType = 'raw' | 'operation' | 'micheline';

export type Network = 'mainnet' | 'ghostnet';

export interface TConnectTezosWcProviderOptions {
	apiKey: string;
	network: Network;
	bridgeUrl: string;
	walletApp?: TezosWcWalletApp;
}

export interface SerializedTConnectTezosWcProvider {
	walletApp: TezosWcWalletApp | undefined;
	network: Network;
	bridgeUrl: string;
	_apiKey: string;
	_communicationController: string;
	_sessionId: string;
	_walletConnectUri: string;
}

export interface TConnectTezosWcProviderEvents {
	connectionString: string;
	disconnect: undefined;
}

export type GetAccountsResult = [
	{
		address: string;
		pubkey: string;
		algo: string; // 'ed25519'
	},
];

export interface SignResult {
	signature: string;
}

export interface SendResult {
	operationHash: string;
}

export interface RequestSignPayloadInput {
	signingType?: SigningType;
	payload: string;
	sourceAddress?: string;
}
