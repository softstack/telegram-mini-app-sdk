export declare class TypedEvent<Events extends Record<string, any>> {
    private _target;
    private _listeners;
    private _disposed;
    on<EventName extends keyof Events & string>(eventName: EventName, listener: (eventArgument: Events[EventName]) => void): this;
    once<EventName extends keyof Events & string>(eventName: EventName, listener: (eventArgument: Events[EventName]) => void): this;
    off<EventName extends keyof Events & string>(eventName: EventName, listener: (eventArgument: Events[EventName]) => void): this;
    removeListener<EventName extends keyof Events & string>(eventName: EventName, listener: (eventArgument: Events[EventName]) => void): this;
    removeAllListeners<EventName extends keyof Events & string>(eventName?: EventName): this;
    protected dispose(): void;
    protected emit<EventName extends keyof Events & string>(eventName: EventName, eventArgument: Events[EventName]): void;
}
