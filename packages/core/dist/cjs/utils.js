"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.stringify = exports.validateKeys = exports.validateGuardian = exports.validateType = exports.validateSchema = void 0;
const typed_stringify_1 = require("@softstack/typed-stringify");
const validateSchema = (value, schema) => {
    const { error, value: validatedValue } = schema.validate(value);
    if (error) {
        throw error;
    }
    return validatedValue;
};
exports.validateSchema = validateSchema;
const validateType = (value, schema) => {
    const { error } = schema.validate(value);
    return !error;
};
exports.validateType = validateType;
const validateGuardian = (value, schema) => (0, exports.validateType)(value, schema);
exports.validateGuardian = validateGuardian;
const validateKeys = (value, keys) => {
    if (typeof value !== 'object' || value === null) {
        return false;
    }
    const valueKeys = Object.keys(value);
    if (valueKeys.length !== keys.length) {
        return false;
    }
    for (const key of keys) {
        if (!valueKeys.includes(key.toString())) {
            return false;
        }
    }
    return true;
};
exports.validateKeys = validateKeys;
const customStringify = (obj) => {
    if (obj instanceof Buffer) {
        return { useResult: true, result: { t: 'Buffer', v: obj.toString('base64') } };
    }
    return { useResult: false };
};
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
const stringify = (obj) => {
    return (0, typed_stringify_1.stringify)(obj, { customStringify });
};
exports.stringify = stringify;
const parse = (json) => {
    return (0, typed_stringify_1.parse)(json, { customParse });
};
exports.parse = parse;
//# sourceMappingURL=utils.js.map