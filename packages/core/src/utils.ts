import {
	parse as _parse,
	stringify as _stringify,
	CustomParse,
	CustomStringify,
	TypedValue,
} from '@softstack/typed-stringify';
import Joi, { PartialSchemaMap, Schema } from 'joi';
import { CustomStrigifyType } from './types';

export const validateSchema = <T>(value: T, schema: Schema<T>): T => {
	const { error, value: validatedValue } = schema.validate(value);
	if (error) {
		throw error;
	}
	return validatedValue;
};

export const validateType = (value: unknown, schema: Schema): boolean => {
	const { error } = schema.validate(value);
	return !error;
};

export const validateGuardian = <T>(value: unknown, schema: Schema): value is T => validateType(value, schema);

export const validateKeys = <T>(value: unknown, keys: Array<keyof T>): value is T => {
	const keyMap: PartialSchemaMap = {};
	for (const key of keys) {
		keyMap[key] = Joi.any().required();
	}
	const schema = Joi.object().keys(keyMap);
	return validateType(value, schema);
};

const customStringify: CustomStringify<CustomStrigifyType> = (obj) => {
	if (obj instanceof Buffer) {
		return { useResult: true, result: { t: 'Buffer', v: obj.toString('base64') } };
	}
	return { useResult: false };
};

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

export const stringify = (obj: unknown): string => {
	return _stringify(obj, { customStringify });
};

export const parse = (s: string): unknown => {
	return _parse(s, { customParse });
};
