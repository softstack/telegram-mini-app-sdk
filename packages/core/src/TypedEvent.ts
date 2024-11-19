import { toEventListener } from './base';
import { TupleMap } from './TupleMap';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class TypedEvent<Events extends Record<string, any>> {
	private _target = new EventTarget();
	private _listeners = new TupleMap<
		keyof Events & string,
		(eventArgument: Events[keyof Events & string]) => void,
		(event: Event) => void
	>();
	private _disposed = false;

	on<EventName extends keyof Events & string>(
		eventName: EventName,
		listener: (eventArgument: Events[EventName]) => void,
	): this {
		if (!this._disposed) {
			const eventListener = toEventListener(listener);
			this._target.addEventListener(eventName, eventListener);
			this._listeners.set(eventName, listener as (eventArgument: Events[keyof Events & string]) => void, eventListener);
		}
		return this;
	}

	once<EventName extends keyof Events & string>(
		eventName: EventName,
		listener: (eventArgument: Events[EventName]) => void,
	): this {
		if (!this._disposed) {
			const eventListener = toEventListener(listener);
			this._target.addEventListener(eventName, eventListener, { once: true });
			this._listeners.set(eventName, listener as (eventArgument: Events[keyof Events & string]) => void, eventListener);
		}
		return this;
	}

	off<EventName extends keyof Events & string>(
		eventName: EventName,
		listener: (eventArgument: Events[EventName]) => void,
	): this {
		return this.removeListener(eventName, listener);
	}

	removeListener<EventName extends keyof Events & string>(
		eventName: EventName,
		listener: (eventArgument: Events[EventName]) => void,
	): this {
		const eventListener = this._listeners.get(
			eventName,
			listener as (eventArgument: Events[keyof Events & string]) => void,
		);
		if (eventListener) {
			this._target.removeEventListener(eventName, eventListener);
			this._listeners.delete(eventName, listener as (eventArgument: Events[keyof Events & string]) => void);
		}
		return this;
	}

	removeAllListeners<EventName extends keyof Events & string>(eventName?: EventName): this {
		for (const [name, listener, eventListener] of this._listeners) {
			if (!eventName || name === eventName) {
				this._target.removeEventListener(name, eventListener);
				this._listeners.delete(name, listener);
			}
		}
		return this;
	}

	protected dispose(): void {
		this._disposed = true;
		this.removeAllListeners();
	}

	protected emit<EventName extends keyof Events & string>(
		eventName: EventName,
		eventArgument: Events[EventName],
	): void {
		if (!this._disposed) {
			this._target.dispatchEvent(new CustomEvent(eventName, { detail: eventArgument }));
		}
	}
}
