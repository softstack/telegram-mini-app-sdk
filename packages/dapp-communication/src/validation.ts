import { validateSchema } from '@tconnect.io/core';
import Joi from 'joi';
import { WrappedResponse } from './types';

export const validateWrappedResponse = <Response>(value: WrappedResponse<Response>): WrappedResponse<Response> =>
	validateSchema(
		value,
		Joi.object({
			requestId: Joi.string().uuid().required(),
			response: Joi.any(),
		}).required(),
	);
