/**
 * A class that provides strongly-typed event handling.
 * @template Events - A record of event names to event argument types.
 */
export declare class TypedEvent<Events extends Record<string, any>> {
    /**
     * An instance of `EventTarget` used to manage event listeners and dispatch events.
     * This private property is used internally to handle event-related operations.
     *
     * @private
     */
    private _target;
    /**
     * A map of event listeners where the key is a string representing the event name,
     * and the value is a tuple containing two functions:
     * - The first function takes an event argument of type `Events[keyof Events & string]` and returns void.
     * - The second function takes an `Event` object and returns void.
     *
     * @private
     */
    private _listeners;
    /**
     * A flag indicating whether the event has been disposed.
     *
     * @private
     */
    private _disposed;
    /**
     * Registers an event listener for the specified event.
     * @param eventName - The name of the event to listen for.
     * @param listener - The callback function to invoke when the event is fired.
     * @returns The current instance for chaining.
     */
    on<EventName extends keyof Events & string>(eventName: EventName, listener: (eventArgument: Events[EventName]) => void): this;
    /**
     * Registers a one-time event listener for the specified event.
     * The listener is automatically removed after it is invoked once.
     * @param eventName - The name of the event to listen for.
     * @param listener - The callback function to invoke when the event is fired.
     * @returns The current instance for chaining.
     */
    once<EventName extends keyof Events & string>(eventName: EventName, listener: (eventArgument: Events[EventName]) => void): this;
    /**
     * Removes an event listener for the specified event.
     * @param eventName - The name of the event.
     * @param listener - The callback function to remove.
     * @returns The current instance for chaining.
     */
    off<EventName extends keyof Events & string>(eventName: EventName, listener: (eventArgument: Events[EventName]) => void): this;
    /**
     * Removes an event listener for the specified event.
     * @param eventName - The name of the event.
     * @param listener - The callback function to remove.
     * @returns The current instance for chaining.
     */
    removeListener<EventName extends keyof Events & string>(eventName: EventName, listener: (eventArgument: Events[EventName]) => void): this;
    /**
     * Removes all listeners for the specified event name. If no event name is provided,
     * it removes all listeners for all events.
     *
     * @template EventName - The type of the event name.
     * @param {EventName} [eventName] - The name of the event for which to remove all listeners.
     * @returns {this} The current instance for chaining.
     */
    removeAllListeners<EventName extends keyof Events & string>(eventName?: EventName): this;
    /**
     * Disposes of the current instance by marking it as disposed and removing all listeners.
     *
     * @protected
     */
    protected dispose(): void;
    /**
     * Emits a custom event with the specified name and argument.
     *
     * @template EventName - The type of the event name, which must be a key of the `Events` interface and a string.
     * @param eventName - The name of the event to emit.
     * @param eventArgument - The argument to pass with the event, corresponding to the event name.
     * @returns void
     */
    protected emit<EventName extends keyof Events & string>(eventName: EventName, eventArgument: Events[EventName]): void;
}
