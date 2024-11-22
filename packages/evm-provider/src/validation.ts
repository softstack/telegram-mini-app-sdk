import { validateSchema } from '@tconnect.io/core';
import { EvmErrorResponse, EvmEvent, EvmResponse } from '@tconnect.io/evm-api-types';
import Joi from 'joi';

/**
 * Validates an EVM response object against a predefined schema.
 *
 * The function checks if the provided value matches one of the allowed schemas
 * for EVM responses or EVM error responses. The schemas include various types
 * of responses such as 'error', 'connect', 'connected', 'request', 'reconnect',
 * and 'disconnect', each with their own specific payload requirements.
 *
 * @param value - The EVM response or error response to validate.
 * @returns The validated EVM response or error response.
 *
 * @example
 * ```typescript
 * const response = {
 *   type: 'connect',
 *   payload: {
 *     sessionId: '12345',
 *     walletConnectUri: 'wc:...',
 *   },
 * };
 * const validatedResponse = validateEvmResponse(response);
 * ```
 */
export const validateEvmResponse = (value: EvmResponse | EvmErrorResponse): EvmResponse | EvmErrorResponse =>
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
							type: Joi.string().valid('invalidSessionId', 'walletRequestFailed', 'invalidApiKey').required(),
							message: Joi.string().allow('').required(),
						}),
					),
				}),
				Joi.object({
					type: Joi.string().valid('connect').required(),
					payload: Joi.object({
						sessionId: Joi.string().required(),
						walletConnectUri: Joi.string().required(),
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
					payload: Joi.any(),
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
 * Validates an EvmEvent object against predefined schemas.
 *
 * The function checks if the provided `value` matches one of the following schemas:
 * - `connect`: An object with a `type` of 'connect' and a `payload` containing a `chainId` string.
 * - `message`: An object with a `type` of 'message' and a `payload` containing a `type` string and `data` of any type.
 * - `chainChanged`: An object with a `type` of 'chainChanged' and a `payload` string.
 * - `accountsChanged`: An object with a `type` of 'accountsChanged' and a `payload` array of strings.
 * - `disconnect`: An object with a `type` of 'disconnect' and a `payload` containing a `message` string, a `code` number, and `data` of any type.
 *
 * @param value - The EvmEvent object to validate.
 * @returns The validated EvmEvent object.
 * @throws Will throw an error if the `value` does not match any of the predefined schemas.
 */
export const validateEvmEvent = (value: EvmEvent): EvmEvent =>
	validateSchema(
		value,
		Joi.alternatives()
			.try(
				Joi.object({
					type: Joi.string().valid('connect').required(),
					payload: Joi.object({
						chainId: Joi.string().required(),
					}),
				}),
				Joi.object({
					type: Joi.string().valid('message').required(),
					payload: Joi.object({
						type: Joi.string().required(),
						data: Joi.any(),
					}),
				}),
				Joi.object({
					type: Joi.string().valid('chainChanged').required(),
					payload: Joi.string().required(),
				}),
				Joi.object({
					type: Joi.string().valid('accountsChanged').required(),
					payload: Joi.array().items(Joi.string()).required(),
				}),
				Joi.object({
					type: Joi.string().valid('disconnect').required(),
					payload: Joi.object({
						message: Joi.string().required(),
						code: Joi.number().required(),
						data: Joi.any(),
					}),
				}),
			)
			.required(),
	);
