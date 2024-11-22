export class CallbackController {
    constructor(timeout) {
        this._callbacks = new Map();
        this._timeout = timeout;
    }
    addCallback(id) {
        if (this._callbacks.has(id)) {
            throw new Error('Callback already exists');
        }
        return new Promise((resolve, reject) => {
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
    resolveCallback(id, response) {
        const callback = this._callbacks.get(id);
        if (callback) {
            this._callbacks.delete(id);
            setTimeout(() => callback.resolve(response), 0);
            return true;
        }
        return false;
    }
    rejectCallback(id, error) {
        const callback = this._callbacks.get(id);
        if (callback) {
            this._callbacks.delete(id);
            setTimeout(() => callback.reject(error), 0);
            return true;
        }
        return false;
    }
    removeCallback(id) {
        return this._callbacks.delete(id);
    }
}
//# sourceMappingURL=CallbackController.js.map