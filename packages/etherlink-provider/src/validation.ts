import { validateSchema } from '@tconnect.io/core';
import { EtherlinkErrorResponse, EtherlinkEvent, EtherlinkResponse } from '@tconnect.io/etherlink-api-types';
import Joi from 'joi';

/**
 * Validates an Etherlink response object against a predefined schema.
 *
 * The function checks if the provided value matches one of the allowed schemas
 * for Etherlink responses or Etherlink error responses. The schemas include various types
 * of responses such as 'error', 'connect', 'connected', 'request', 'reconnect',
 * and 'disconnect', each with their own specific payload requirements.
 *
 * @param value - The Etherlink response or error response to validate.
 * @returns The validated Etherlink response or error response.
 *
 * @example
 * ```typescript
 * const response = {
 *   type: 'connect',
 *   payload: {
 *     sessionId: '12345',
 *   },
 * };
 * const validatedResponse = validateEtherlinkResponse(response);
 * ```
 */
export const validateEtherlinkResponse = (
	value: EtherlinkResponse | EtherlinkErrorResponse,
): EtherlinkResponse | EtherlinkErrorResponse =>
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
 * Validates an EtherlinkEvent object against predefined schemas.
 *
 * The function checks if the provided `value` matches one of the following schemas:
 * - `connect`: An object with a `type` of 'connect' and a `payload` containing a `chainId` string.
 * - `message`: An object with a `type` of 'message' and a `payload` containing a `type` string and `data` of any type.
 * - `chainChanged`: An object with a `type` of 'chainChanged' and a `payload` string.
 * - `accountsChanged`: An object with a `type` of 'accountsChanged' and a `payload` array of strings.
 * - `disconnect`: An object with a `type` of 'disconnect' and a `payload` containing a `message` string, a `code` number, and `data` of any type.
 *
 * @param value - The EtherlinkEvent object to validate.
 * @returns The validated EtherlinkEvent object.
 * @throws Will throw an error if the `value` does not match any of the predefined schemas.
 */
export const validateEtherlinkEvent = (value: EtherlinkEvent): EtherlinkEvent =>
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
