"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.stringify = exports.validateKeys = exports.validateGuardian = exports.validateType = exports.validateSchema = void 0;
const typed_stringify_1 = require("@softstack/typed-stringify");
const joi_1 = __importDefault(require("joi"));
/**
 * Validates a given value against a specified schema.
 *
 * @template T - The type of the value to be validated.
 * @param {T} value - The value to be validated.
 * @param {Schema<T>} schema - The schema to validate the value against.
 * @returns {T} - The validated value.
 * @throws {Error} - Throws an error if the validation fails.
 */
const validateSchema = (value, schema) => {
    const { error, value: validatedValue } = schema.validate(value);
    if (error) {
        throw error;
    }
    return validatedValue;
};
exports.validateSchema = validateSchema;
/**
 * Validates a value against a given schema.
 *
 * @param value - The value to be validated.
 * @param schema - The schema to validate the value against.
 * @returns `true` if the value is valid according to the schema, otherwise `false`.
 */
const validateType = (value, schema) => {
    const { error } = schema.validate(value);
    return !error;
};
exports.validateType = validateType;
/**
 * Validates the given value against the provided schema and asserts its type.
 *
 * @template T - The expected type of the value.
 * @param value - The value to be validated.
 * @param schema - The schema to validate the value against.
 * @returns A boolean indicating whether the value conforms to the schema and is of type T.
 */
const validateGuardian = (value, schema) => (0, exports.validateType)(value, schema);
exports.validateGuardian = validateGuardian;
/**
 * Validates that the given value contains the specified keys.
 *
 * @template T - The type of the object to validate.
 * @param value - The value to validate.
 * @param keys - An array of keys that the value should contain.
 * @returns A boolean indicating whether the value contains the specified keys.
 */
const validateKeys = (value, keys) => {
    const keyMap = {};
    for (const key of keys) {
        keyMap[key] = joi_1.default.any().required();
    }
    const schema = joi_1.default.object().keys(keyMap);
    return (0, exports.validateType)(value, schema);
};
exports.validateKeys = validateKeys;
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
const customStringify = (obj) => {
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
const customParse = (obj) => {
    const { t, v } = obj;
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
const stringify = (obj) => {
    return (0, typed_stringify_1.stringify)(obj, { customStringify });
};
exports.stringify = stringify;
/**
 * Parses a JSON string and returns the resulting object.
 *
 * @param json - The JSON string to parse.
 * @returns The parsed object.
 */
const parse = (json) => {
    return (0, typed_stringify_1.parse)(json, { customParse });
};
exports.parse = parse;
//# sourceMappingURL=utils.js.map