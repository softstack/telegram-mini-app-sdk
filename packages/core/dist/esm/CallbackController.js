/**
 * A controller class to manage callback functions with a timeout mechanism.
 *
 * @template Response - The type of the response object.
 * @template Id - The type of the identifier for the callbacks, defaults to string.
 */
export class CallbackController {
    constructor(timeout) {
        this._callbacks = new Map();
        this._timeout = timeout;
    }
    /**
     * Adds a callback with the specified ID to the controller.
     * If a callback with the same ID already exists, an error is thrown.
     * The callback will be automatically rejected with a timeout error if it is not resolved within the specified timeout period.
     *
     * @param id - The unique identifier for the callback.
     * @returns A promise that resolves with the response or rejects with an error.
     * @throws {Error} If a callback with the same ID already exists.
     */
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
    /**
     * Resolves a callback with the given response.
     *
     * @param id - The unique identifier of the callback to resolve.
     * @param response - The response to pass to the callback.
     * @returns A boolean indicating whether the callback was successfully resolved.
     */
    resolveCallback(id, response) {
        const callback = this._callbacks.get(id);
        if (callback) {
            this._callbacks.delete(id);
            setTimeout(() => callback.resolve(response), 0);
            return true;
        }
        return false;
    }
    /**
     * Rejects a callback with the given error.
     *
     * @param id - The unique identifier of the callback to reject.
     * @param error - The error to reject the callback with.
     * @returns A boolean indicating whether the callback was found and rejected.
     */
    rejectCallback(id, error) {
        const callback = this._callbacks.get(id);
        if (callback) {
            this._callbacks.delete(id);
            setTimeout(() => callback.reject(error), 0);
            return true;
        }
        return false;
    }
    /**
     * Removes a callback from the internal callback collection.
     *
     * @param id - The identifier of the callback to be removed.
     * @returns A boolean indicating whether the callback was successfully removed.
     */
    removeCallback(id) {
        return this._callbacks.delete(id);
    }
}
//# sourceMappingURL=CallbackController.js.map