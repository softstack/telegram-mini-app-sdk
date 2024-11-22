import { toEventListener } from './base';
import { TupleMap } from './TupleMap';
export class TypedEvent {
    constructor() {
        this._target = new EventTarget();
        this._listeners = new TupleMap();
        this._disposed = false;
    }
    on(eventName, listener) {
        if (!this._disposed) {
            const eventListener = toEventListener(listener);
            this._target.addEventListener(eventName, eventListener);
            this._listeners.set(eventName, listener, eventListener);
        }
        return this;
    }
    once(eventName, listener) {
        if (!this._disposed) {
            const eventListener = toEventListener(listener);
            this._target.addEventListener(eventName, eventListener, { once: true });
            this._listeners.set(eventName, listener, eventListener);
        }
        return this;
    }
    off(eventName, listener) {
        return this.removeListener(eventName, listener);
    }
    removeListener(eventName, listener) {
        const eventListener = this._listeners.get(eventName, listener);
        if (eventListener) {
            this._target.removeEventListener(eventName, eventListener);
            this._listeners.delete(eventName, listener);
        }
        return this;
    }
    removeAllListeners(eventName) {
        for (const [name, listener, eventListener] of this._listeners) {
            if (!eventName || name === eventName) {
                this._target.removeEventListener(name, eventListener);
                this._listeners.delete(name, listener);
            }
        }
        return this;
    }
    dispose() {
        this._disposed = true;
        this.removeAllListeners();
    }
    emit(eventName, eventArgument) {
        if (!this._disposed) {
            this._target.dispatchEvent(new CustomEvent(eventName, { detail: eventArgument }));
        }
    }
}
//# sourceMappingURL=TypedEvent.js.map