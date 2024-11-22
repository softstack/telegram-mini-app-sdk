export declare class CallbackController<Response, Id = string> {
    constructor(timeout: number);
    private readonly _timeout;
    private readonly _callbacks;
    addCallback(id: Id): Promise<Response>;
    resolveCallback(id: Id, response: Response): boolean;
    rejectCallback(id: Id, error: Error): boolean;
    removeCallback(id: Id): boolean;
}
