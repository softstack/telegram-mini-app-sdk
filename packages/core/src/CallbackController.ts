export class CallbackController<Response, Id = string> {
	constructor(timeout: number) {
		this._timeout = timeout;
	}

	private readonly _timeout: number;
	private readonly _callbacks = new Map<
		Id,
		{ resolve: (response: Response) => void; reject: (error: Error) => void }
	>();

	addCallback(id: Id): Promise<Response> {
		if (this._callbacks.has(id)) {
			throw new Error('Callback already exists');
		}
		return new Promise<Response>((resolve, reject) => {
			this._callbacks.set(id, { resolve, reject });
			setTimeout(() => {
				const callback = this._callbacks.get(id);
				if (callback) {
					this._callbacks.delete(id);
					callback.reject(new Error('Timeout'));
				}
			}, this._timeout);
		});
	}

	resolveCallback(id: Id, response: Response): boolean {
		const callback = this._callbacks.get(id);
		if (callback) {
			this._callbacks.delete(id);
			setTimeout(() => callback.resolve(response), 0);
			return true;
		}
		return false;
	}

	rejectCallback(id: Id, error: Error): boolean {
		const callback = this._callbacks.get(id);
		if (callback) {
			this._callbacks.delete(id);
			setTimeout(() => callback.reject(error), 0);
			return true;
		}
		return false;
	}

	removeCallback(id: Id): boolean {
		return this._callbacks.delete(id);
	}
}
