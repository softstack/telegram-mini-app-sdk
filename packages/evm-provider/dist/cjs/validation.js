"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEvmEvent = exports.validateEvmResponse = void 0;
const core_1 = require("@tconnect.io/core");
const joi_1 = __importDefault(require("joi"));
const validateEvmResponse = (value) => (0, core_1.validateSchema)(value, joi_1.default.alternatives()
    .try(joi_1.default.object({
    type: joi_1.default.string().valid('error').required(),
    payload: joi_1.default.alternatives(joi_1.default.object({
        type: joi_1.default.string().valid('generic').required(),
        key: joi_1.default.string().required(),
        message: joi_1.default.string(),
    }), joi_1.default.object({
        type: joi_1.default.string().valid('invalidSessionId', 'walletRequestFailed', 'invalidApiKey').required(),
        message: joi_1.default.string(),
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
    payload: joi_1.default.any(),
}), joi_1.default.object({
    type: joi_1.default.string().valid('reconnect').required(),
}), joi_1.default.object({
    type: joi_1.default.string().valid('disconnect').required(),
}))
    .required());
exports.validateEvmResponse = validateEvmResponse;
const validateEvmEvent = (value) => (0, core_1.validateSchema)(value, joi_1.default.alternatives()
    .try(joi_1.default.object({
    type: joi_1.default.string().valid('connect').required(),
    payload: joi_1.default.object({
        chainId: joi_1.default.string().required(),
    }),
}), joi_1.default.object({
    type: joi_1.default.string().valid('message').required(),
    payload: joi_1.default.object({
        type: joi_1.default.string().required(),
        data: joi_1.default.any(),
    }),
}), joi_1.default.object({
    type: joi_1.default.string().valid('chainChanged').required(),
    payload: joi_1.default.string().required(),
}), joi_1.default.object({
    type: joi_1.default.string().valid('accountsChanged').required(),
    payload: joi_1.default.array().items(joi_1.default.string()).required(),
}), joi_1.default.object({
    type: joi_1.default.string().valid('disconnect').required(),
    payload: joi_1.default.object({
        message: joi_1.default.string().required(),
        code: joi_1.default.number().required(),
        data: joi_1.default.any(),
    }),
}))
    .required());
exports.validateEvmEvent = validateEvmEvent;
//# sourceMappingURL=validation.js.map