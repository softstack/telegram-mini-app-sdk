import { validateSchema } from '@tconnect.io/core';
import Joi from 'joi';
export const validateWrappedResponse = (value) => validateSchema(value, Joi.object({
    requestId: Joi.string().uuid().required(),
    response: Joi.any(),
}).required());
//# sourceMappingURL=validation.js.map