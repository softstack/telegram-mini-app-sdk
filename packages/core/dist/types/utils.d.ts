import { Schema } from 'joi';
/**
 * Validates a given value against a specified schema.
 *
 * @template T - The type of the value to be validated.
 * @param {T} value - The value to be validated.
 * @param {Schema<T>} schema - The schema to validate the value against.
 * @returns {T} - The validated value.
 * @throws {Error} - Throws an error if the validation fails.
 */
export declare const validateSchema: <T>(value: T, schema: Schema<T>) => T;
/**
 * Validates a value against a given schema.
 *
 * @param value - The value to be validated.
 * @param schema - The schema to validate the value against.
 * @returns `true` if the value is valid according to the schema, otherwise `false`.
 */
export declare const validateType: (value: unknown, schema: Schema) => boolean;
/**
 * Validates the given value against the provided schema and asserts its type.
 *
 * @template T - The expected type of the value.
 * @param value - The value to be validated.
 * @param schema - The schema to validate the value against.
 * @returns A boolean indicating whether the value conforms to the schema and is of type T.
 */
export declare const validateGuardian: <T>(value: unknown, schema: Schema) => value is T;
/**
 * Validates that the given value contains the specified keys.
 *
 * @template T - The type of the object to validate.
 * @param value - The value to validate.
 * @param keys - An array of keys that the value should contain.
 * @returns A boolean indicating whether the value contains the specified keys.
 */
export declare const validateKeys: <T>(value: unknown, keys: Array<keyof T>) => value is T;
/**
 * Converts an unknown object to a JSON string representation.
 *
 * @param obj - The object to be stringified.
 * @returns The JSON string representation of the object.
 */
export declare const stringify: (obj: unknown) => string;
/**
 * Parses a JSON string and returns the resulting object.
 *
 * @param json - The JSON string to parse.
 * @returns The parsed object.
 */
export declare const parse: (json: string) => unknown;
