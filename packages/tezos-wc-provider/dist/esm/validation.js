import { validateSchema, validateType } from '@tconnect.io/core';
import Joi from 'joi';
export const validateTezosWcResponse = (value) => validateSchema(value, Joi.alternatives()
    .try(Joi.object({
    type: Joi.string().valid('error').required(),
    payload: Joi.alternatives(Joi.object({
        type: Joi.string().valid('generic').required(),
        key: Joi.string().required(),
        message: Joi.string(),
    }), Joi.object({
        type: Joi.string().valid('invalidSessionId', 'invalidApiKey', 'walletRequestFailed').required(),
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
    payload: Joi.any().required(),
}), Joi.object({
    type: Joi.string().valid('reconnect').required(),
}), Joi.object({
    type: Joi.string().valid('disconnect').required(),
}))
    .required());
export const validateTezosWcEvent = (value) => validateSchema(value, Joi.alternatives()
    .try(Joi.object({
    type: Joi.string().valid('connect').required(),
    payload: Joi.object({
        sessionId: Joi.string().required(),
    }),
}))
    .required());
export const isGetAccountsResult = (value) => validateType(value, Joi.array()
    .length(1)
    .items(Joi.object({
    address: Joi.string().required(),
    pubkey: Joi.string().required(),
    algo: Joi.string().required(),
}).options({ allowUnknown: true })));
export const isSignResult = (value) => validateType(value, Joi.object({ signature: Joi.string().required() }).options({ allowUnknown: true }));
export const isSendResult = (value) => validateType(value, Joi.object({ operationHash: Joi.string().required() }).options({ allowUnknown: true }));
//# sourceMappingURL=validation.js.map