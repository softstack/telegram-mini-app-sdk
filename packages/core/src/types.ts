import { StringifyType } from '@softstack/typed-stringify';

/**
 * A type that extends `StringifyType` to include the 'Buffer' type.
 * This type is used to specify custom stringification options.
 */
export type CustomStrigifyType = StringifyType | 'Buffer';
