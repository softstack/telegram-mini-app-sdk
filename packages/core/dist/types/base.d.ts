export declare const hasOwnProperty: <X, Y extends PropertyKey>(object: X, property: Y) => object is X & Record<Y, unknown>;
export declare const sleep: (ms: number) => Promise<void>;
export declare const joinUrl: (...parts: Array<string>) => string;
export declare const toEventListener: <Payload>(handler: (payload: Payload) => void) => (event: Event) => void;
