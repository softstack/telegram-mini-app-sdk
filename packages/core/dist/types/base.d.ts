/**
 * Checks if an object has a property as its own (not inherited).
 *
 * @template X - The type of the object.
 * @template Y - The type of the property key.
 * @param object - The object to check.
 * @param property - The property key to check for.
 * @returns A type predicate indicating whether the object has the property.
 */
export declare const hasOwnProperty: <X, Y extends PropertyKey>(object: X, property: Y) => object is X & Record<Y, unknown>;
/**
 * Pauses the execution for a specified number of milliseconds.
 *
 * @param ms - The number of milliseconds to sleep.
 * @returns A promise that resolves after the specified duration.
 */
export declare const sleep: (ms: number) => Promise<void>;
/**
 * Joins multiple parts of a URL into a single URL string.
 *
 * @param parts - An array of strings representing parts of a URL.
 * @returns The concatenated URL string.
 *
 * @example
 * ```typescript
 * const url = joinUrl('http://example.com', 'path', 'to', 'resource');
 * console.log(url); // Output: 'http://example.com/path/to/resource'
 * ```
 */
export declare const joinUrl: (...parts: Array<string>) => string;
/**
 * Converts a handler function into an event listener.
 *
 * @template Payload - The type of the payload expected by the handler.
 * @param handler - A function that takes a payload of type `Payload` and returns void.
 * @returns A function that takes an `Event` and calls the handler with the event's detail.
 */
export declare const toEventListener: <Payload>(handler: (payload: Payload) => void) => (event: Event) => void;
