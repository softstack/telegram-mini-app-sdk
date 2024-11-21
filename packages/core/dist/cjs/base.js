"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toEventListener = exports.joinUrl = exports.sleep = exports.hasOwnProperty = void 0;
/**
 * Checks if an object has a property as its own (not inherited).
 *
 * @template X - The type of the object.
 * @template Y - The type of the property key.
 * @param object - The object to check.
 * @param property - The property key to check for.
 * @returns A type predicate indicating whether the object has the property.
 */
const hasOwnProperty = (object, property) => Object.prototype.hasOwnProperty.call(object, property);
exports.hasOwnProperty = hasOwnProperty;
/**
 * Pauses the execution for a specified number of milliseconds.
 *
 * @param ms - The number of milliseconds to sleep.
 * @returns A promise that resolves after the specified duration.
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
exports.sleep = sleep;
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
const joinUrl = (...parts) => {
    let url = '';
    for (let part of parts) {
        if (url) {
            if (url.endsWith('/')) {
                url = url.slice(0, -1);
            }
            if (part.startsWith('/')) {
                part = part.slice(1);
            }
            url = `${url}/${part}`;
        }
        else {
            url = part;
        }
    }
    return url;
};
exports.joinUrl = joinUrl;
/**
 * Converts a handler function into an event listener.
 *
 * @template Payload - The type of the payload expected by the handler.
 * @param handler - A function that takes a payload of type `Payload` and returns void.
 * @returns A function that takes an `Event` and calls the handler with the event's detail.
 */
const toEventListener = (handler) => (event) => {
    handler(event.detail);
};
exports.toEventListener = toEventListener;
//# sourceMappingURL=base.js.map