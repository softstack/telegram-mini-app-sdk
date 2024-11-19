import { parse as _parse, stringify as _stringify, } from '@softstack/typed-stringify';
import Joi from 'joi';
export const validateSchema = (value, schema) => {
    const { error, value: validatedValue } = schema.validate(value);
    if (error) {
        throw error;
    }
    return validatedValue;
};
export const validateType = (value, schema) => {
    const { error } = schema.validate(value);
    return !error;
};
export const validateGuardian = (value, schema) => validateType(value, schema);
export const validateKeys = (value, keys) => {
    const keyMap = {};
    for (const key of keys) {
        keyMap[key] = Joi.any().required();
    }
    const schema = Joi.object().keys(keyMap);
    return validateType(value, schema);
};
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
export const stringify = (obj) => {
    return _stringify(obj, { customStringify });
};
export const parse = (s) => {
    return _parse(s, { customParse });
};
//# sourceMappingURL=utils.js.map