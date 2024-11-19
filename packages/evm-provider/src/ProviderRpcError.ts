export class ProviderRpcError extends Error {
	constructor(message: string, code: number, data?: unknown) {
		super(message);
		this.code = code;
		this.data = data;
	}

	readonly code: number;
	readonly data?: unknown;
}
