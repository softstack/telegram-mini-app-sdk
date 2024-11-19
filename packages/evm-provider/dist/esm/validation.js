import { validateSchema } from '@tconnect.io/core';
import Joi from 'joi';
export const validateEvmResponse = (value) => validateSchema(value, Joi.alternatives()
    .try(Joi.object({
    type: Joi.string().valid('error').required(),
    payload: Joi.alternatives(Joi.object({
        type: Joi.string().valid('generic').required(),
        key: Joi.string().required(),
        message: Joi.string(),
    }), Joi.object({
        type: Joi.string().valid('invalidSessionId', 'walletRequestFailed', 'invalidApiKey').required(),
        message: Joi.string(),
    })),
}), Joi.object({
    type: Joi.string().valid('connect').required(),
    payload: Joi.object({
        sessionId: Joi.string().required(),
        walletConnectUri: Joi.string().required(),
    }),
}), Joi.object({
    type: Joi.string().valid('connected').required(),
    payload: Joi.object({
        connected: Joi.boolean().required(),
    }),
}), Joi.object({
    type: Joi.string().valid('request').required(),
    payload: Joi.any(),
}), Joi.object({
    type: Joi.string().valid('reconnect').required(),
}), Joi.object({
    type: Joi.string().valid('disconnect').required(),
}))
    .required());
export const validateEvmEvent = (value) => validateSchema(value, Joi.alternatives()
    .try(Joi.object({
    type: Joi.string().valid('connect').required(),
    payload: Joi.object({
        chainId: Joi.string().required(),
    }),
}), Joi.object({
    type: Joi.string().valid('message').required(),
    payload: Joi.object({
        type: Joi.string().required(),
        data: Joi.any(),
    }),
}), Joi.object({
    type: Joi.string().valid('chainChanged').required(),
    payload: Joi.string().required(),
}), Joi.object({
    type: Joi.string().valid('accountsChanged').required(),
    payload: Joi.array().items(Joi.string()).required(),
}), Joi.object({
    type: Joi.string().valid('disconnect').required(),
    payload: Joi.object({
        message: Joi.string().required(),
        code: Joi.number().required(),
        data: Joi.any(),
    }),
}))
    .required());
//# sourceMappingURL=validation.js.map