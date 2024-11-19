import { TypedEvent } from '@tconnect.io/core';
import { CommunicationControllerEvents } from './types';
export declare class CommunicationController<Request, Response, Event> extends TypedEvent<CommunicationControllerEvents<Event>> {
    constructor(bridgeUrl: string, path: string, requestChannel: string, eventChannel: string);
    readonly bridgeUrl: string;
    readonly path: string;
    readonly requestChannel: string;
    readonly eventChannel: string;
    private _socket;
    private _requestCallbacks;
    connect(): Promise<void>;
    connected(): boolean;
    send(request: Request): Promise<Response>;
    disconnect(): void;
    serialize(): string;
    static deserialize<Request, Response, Event>(serialized: string): CommunicationController<Request, Response, Event>;
}
