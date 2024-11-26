import { validateSchema, validateType } from '@tconnect.io/core';
import { TezosWcErrorResponse, TezosWcEvent, TezosWcResponse } from '@tconnect.io/tezos-wc-api-types';
import Joi from 'joi';
import { GetAccountsResult, SendResult, SignResult } from './types';

/**
 * Validates a Tezos WalletConnect response or error response.
 *
 * This function uses Joi schema validation to ensure that the provided value
 * conforms to one of the expected response or error response formats.
 *
 * The valid response types are:
 * - `error`: An error response with a payload that can be either a generic error or specific error types.
 * - `connect`: A response indicating a connection attempt with session details.
 * - `connected`: A response indicating a successful connection.
 * - `request`: A response containing a request payload.
 * - `reconnect`: A response indicating a reconnection attempt.
 * - `disconnect`: A response indicating a disconnection.
 *
 * @param value - The Tezos WalletConnect response or error response to validate.
 * @returns The validated Tezos WalletConnect response or error response.
 */
export const validateTezosWcResponse = (
	value: TezosWcResponse | TezosWcErrorResponse,
): TezosWcResponse | TezosWcErrorResponse =>
	validateSchema(
		value,
		Joi.alternatives()
			.try(
				Joi.object({
					type: Joi.string().valid('error').required(),
					payload: Joi.alternatives().try(
						Joi.object({
							type: Joi.string().valid('generic').required(),
							key: Joi.string().required(),
							message: Joi.string().allow(''),
						}),
						Joi.object({
							type: Joi.string().valid('invalidSessionId', 'invalidApiKey', 'walletRequestFailed').required(),
							message: Joi.string().allow('').required(),
						}),
					),
				}),
				Joi.object({
					type: Joi.string().valid('connect').required(),
					payload: Joi.object({
						sessionId: Joi.string().required(),
					}),
				}),
				Joi.object({
					type: Joi.string().valid('connected').required(),
					payload: Joi.object({
						connected: Joi.boolean().required(),
					}),
				}),
				Joi.object({
					type: Joi.string().valid('request').required(),
					payload: Joi.any().required(),
				}),
				Joi.object({
					type: Joi.string().valid('reconnect').required(),
				}),
				Joi.object({
					type: Joi.string().valid('disconnect').required(),
				}),
			)
			.required(),
	);

/**
 * Validates a Tezos WalletConnect event against a predefined schema.
 *
 * @param value - The Tezos WalletConnect event to validate.
 * @returns The validated Tezos WalletConnect event.
 *
 * The function uses Joi to validate the event. The event must be an object
 * with a `type` property that is a string and must be 'connect'. The `payload`
 * property must be an object containing a `sessionId` string.
 */
export const validateTezosWcEvent = (value: TezosWcEvent): TezosWcEvent =>
	validateSchema(
		value,
		Joi.alternatives()
			.try(
				Joi.object({
					type: Joi.string().valid('connectionString').required(),
					payload: Joi.object({
						connectionString: Joi.string().required(),
					}),
				}),
				Joi.object({
					type: Joi.string().valid('disconnect').required(),
				}),
			)
			.required(),
	);

/**
 * Validates if the provided value conforms to the GetAccountsResult type.
 *
 * @param value - The value to be validated.
 * @returns A boolean indicating whether the value is a valid GetAccountsResult.
 */
export const isGetAccountsResult = (value: unknown): value is GetAccountsResult =>
	validateType(
		value,
		Joi.array()
			.length(1)
			.items(
				Joi.object({
					address: Joi.string().required(),
					pubkey: Joi.string().required(),
					algo: Joi.string().required(),
				}).options({ allowUnknown: true }),
			),
	);

/**
 * Checks if the provided value is a valid SignResult.
 *
 * This function uses Joi schema validation to determine if the value
 * has the required structure of a SignResult, which includes a mandatory
 * `signature` property of type string. The validation allows for unknown
 * properties to be present in the object.
 *
 * @param value - The value to be checked.
 * @returns A boolean indicating whether the value is a SignResult.
 */
export const isSignResult = (value: unknown): value is SignResult =>
	validateType(value, Joi.object({ signature: Joi.string().required() }).options({ allowUnknown: true }));

/**
 * Checks if the provided value is of type `SendResult`.
 *
 * This function uses Joi validation to determine if the value matches the expected structure
 * of a `SendResult` object, which requires an `operationHash` string property. The validation
 * allows for unknown properties to be present in the object.
 *
 * @param value - The value to be checked.
 * @returns `true` if the value is a `SendResult`, otherwise `false`.
 */
export const isSendResult = (value: unknown): value is SendResult =>
	validateType(value, Joi.object({ operationHash: Joi.string().required() }).options({ allowUnknown: true }));
