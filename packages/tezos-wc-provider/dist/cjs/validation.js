"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSendResult = exports.isSignResult = exports.isGetAccountsResult = exports.validateTezosWcEvent = exports.validateTezosWcResponse = void 0;
const core_1 = require("@tconnect.io/core");
const joi_1 = __importDefault(require("joi"));
const validateTezosWcResponse = (value) => (0, core_1.validateSchema)(value, joi_1.default.alternatives()
    .try(joi_1.default.object({
    type: joi_1.default.string().valid('error').required(),
    payload: joi_1.default.alternatives().try(joi_1.default.object({
        type: joi_1.default.string().valid('generic').required(),
        key: joi_1.default.string().required(),
        message: joi_1.default.string().allow(''),
    }), joi_1.default.object({
        type: joi_1.default.string().valid('invalidSessionId', 'invalidApiKey', 'walletRequestFailed').required(),
        message: joi_1.default.string().allow('').required(),
    })),
}), joi_1.default.object({
    type: joi_1.default.string().valid('connect').required(),
    payload: joi_1.default.object({
        sessionId: joi_1.default.string().required(),
        walletConnectUri: joi_1.default.string().required(),
    }),
}), joi_1.default.object({
    type: joi_1.default.string().valid('connected').required(),
    payload: joi_1.default.object({
        connected: joi_1.default.boolean().required(),
    }),
}), joi_1.default.object({
    type: joi_1.default.string().valid('request').required(),
    payload: joi_1.default.any().required(),
}), joi_1.default.object({
    type: joi_1.default.string().valid('reconnect').required(),
}), joi_1.default.object({
    type: joi_1.default.string().valid('disconnect').required(),
}))
    .required());
exports.validateTezosWcResponse = validateTezosWcResponse;
const validateTezosWcEvent = (value) => (0, core_1.validateSchema)(value, joi_1.default.alternatives()
    .try(joi_1.default.object({
    type: joi_1.default.string().valid('connect').required(),
    payload: joi_1.default.object({
        sessionId: joi_1.default.string().required(),
    }),
}))
    .required());
exports.validateTezosWcEvent = validateTezosWcEvent;
const isGetAccountsResult = (value) => (0, core_1.validateType)(value, joi_1.default.array()
    .length(1)
    .items(joi_1.default.object({
    address: joi_1.default.string().required(),
    pubkey: joi_1.default.string().required(),
    algo: joi_1.default.string().required(),
}).options({ allowUnknown: true })));
exports.isGetAccountsResult = isGetAccountsResult;
const isSignResult = (value) => (0, core_1.validateType)(value, joi_1.default.object({ signature: joi_1.default.string().required() }).options({ allowUnknown: true }));
exports.isSignResult = isSignResult;
const isSendResult = (value) => (0, core_1.validateType)(value, joi_1.default.object({ operationHash: joi_1.default.string().required() }).options({ allowUnknown: true }));
exports.isSendResult = isSendResult;
//# sourceMappingURL=validation.js.map