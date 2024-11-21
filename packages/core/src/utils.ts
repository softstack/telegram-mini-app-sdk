import {
	parse as _parse,
	stringify as _stringify,
	CustomParse,
	CustomStringify,
	TypedValue,
} from '@softstack/typed-stringify';
import Joi, { PartialSchemaMap, Schema } from 'joi';
import { CustomStrigifyType } from './types';

/**
 * Validates a given value against a specified schema.
 *
 * @template T - The type of the value to be validated.
 * @param {T} value - The value to be validated.
 * @param {Schema<T>} schema - The schema to validate the value against.
 * @returns {T} - The validated value.
 * @throws {Error} - Throws an error if the validation fails.
 */
export const validateSchema = <T>(value: T, schema: Schema<T>): T => {
	const { error, value: validatedValue } = schema.validate(value);
	if (error) {
		throw error;
	}
	return validatedValue;
};

/**
 * Validates a value against a given schema.
 *
 * @param value - The value to be validated.
 * @param schema - The schema to validate the value against.
 * @returns `true` if the value is valid according to the schema, otherwise `false`.
 */
export const validateType = (value: unknown, schema: Schema): boolean => {
	const { error } = schema.validate(value);
	return !error;
};

/**
 * Validates the given value against the provided schema and asserts its type.
 *
 * @template T - The expected type of the value.
 * @param value - The value to be validated.
 * @param schema - The schema to validate the value against.
 * @returns A boolean indicating whether the value conforms to the schema and is of type T.
 */
export const validateGuardian = <T>(value: unknown, schema: Schema): value is T => validateType(value, schema);

/**
 * Validates that the given value contains the specified keys.
 *
 * @template T - The type of the object to validate.
 * @param value - The value to validate.
 * @param keys - An array of keys that the value should contain.
 * @returns A boolean indicating whether the value contains the specified keys.
 */
export const validateKeys = <T>(value: unknown, keys: Array<keyof T>): value is T => {
	const keyMap: PartialSchemaMap = {};
	for (const key of keys) {
		keyMap[key] = Joi.any().required();
	}
	const schema = Joi.object().keys(keyMap);
	return validateType(value, schema);
};

/**
 * Custom stringify function that handles specific object types.
 *
 * @template T - The type of the object to be stringified.
 * @param {T} obj - The object to be stringified.
 * @returns {CustomStringifyResult} - The result of the custom stringify operation.
 *
 * @example
 * const buffer = Buffer.from('example');
 * const result = customStringify(buffer);
 * // result: { useResult: true, result: { t: 'Buffer', v: 'ZXhhbXBsZQ==' } }
 */
const customStringify: CustomStringify<CustomStrigifyType> = (obj) => {
	if (obj instanceof Buffer) {
		return { useResult: true, result: { t: 'Buffer', v: obj.toString('base64') } };
	}
	return { useResult: false };
};

/**
 * Parses a given object and returns a result based on its type.
 *
 * @template CustomStrigifyType - The type of the value to be parsed.
 * @param {TypedValue<CustomStrigifyType>} obj - The object to be parsed, containing a type and a value.
 * @returns {{ useResult: boolean; result?: Buffer }} An object indicating whether a result was used and the parsed result if applicable.
 * @throws {Error} If the value is undefined for the 'Buffer' type.
 */
const customParse: CustomParse<CustomStrigifyType> = (obj) => {
	const { t, v } = obj as TypedValue<CustomStrigifyType>;
	switch (t) {
		case 'Buffer': {
			if (v === undefined) {
				throw new Error('No value');
			}
			return { useResult: true, result: Buffer.from(v, 'base64') };
		}
	}
	return { useResult: false };
};

/**
 * Converts an unknown object to a JSON string representation.
 *
 * @param obj - The object to be stringified.
 * @returns The JSON string representation of the object.
 */
export const stringify = (obj: unknown): string => {
	return _stringify(obj, { customStringify });
};

/**
 * Parses a JSON string and returns the resulting object.
 *
 * @param json - The JSON string to parse.
 * @returns The parsed object.
 */
export const parse = (json: string): unknown => {
	return _parse(json, { customParse });
};
