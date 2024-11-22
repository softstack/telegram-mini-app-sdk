import { validateSchema } from '@tconnect.io/core';
import Joi from 'joi';
import { WrappedResponse } from './types';

/**
 * Validates a wrapped response object against a predefined schema.
 *
 * @template Response - The type of the response contained within the wrapped response.
 * @param {WrappedResponse<Response>} value - The wrapped response object to validate.
 * @returns {WrappedResponse<Response>} - The validated wrapped response object.
 */
export const validateWrappedResponse = <Response>(value: WrappedResponse<Response>): WrappedResponse<Response> =>
	validateSchema(
		value,
		Joi.object({
			requestId: Joi.string().uuid().required(),
			response: Joi.any(),
		}).required(),
	);
