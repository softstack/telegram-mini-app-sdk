import { parse as _parse, stringify as _stringify, } from '@softstack/typed-stringify';
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
export const parse = (json) => {
    return _parse(json, { customParse });
};
//# sourceMappingURL=utils.js.map