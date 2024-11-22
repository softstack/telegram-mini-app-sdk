import { Schema } from 'joi';
export declare const validateSchema: <T>(value: T, schema: Schema<T>) => T;
export declare const validateType: (value: unknown, schema: Schema) => boolean;
export declare const validateGuardian: <T>(value: unknown, schema: Schema) => value is T;
export declare const validateKeys: <T>(value: unknown, keys: Array<keyof T>) => value is T;
export declare const stringify: (obj: unknown) => string;
export declare const parse: (json: string) => unknown;
