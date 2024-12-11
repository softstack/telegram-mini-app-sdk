"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isErrorResponse = exports.isDisconnectMessage = exports.isSignPayloadResponse = exports.isOperationResponse = exports.isPermissionResponse = exports.isBaseMessage = exports.isPairingResponse = exports.validateTezosBeaconEvent = exports.validateTezosBeaconResponse = void 0;
const core_1 = require("@tconnect.io/core");
const joi_1 = __importDefault(require("joi"));
const validateTezosBeaconResponse = (value) => (0, core_1.validateSchema)(value, joi_1.default.alternatives()
    .try(joi_1.default.object({
    type: joi_1.default.string().valid('error').required(),
    payload: joi_1.default.alternatives().try(joi_1.default.object({
        type: joi_1.default.string().valid('generic').required(),
        key: joi_1.default.string().required(),
        message: joi_1.default.string().allow(''),
    }), joi_1.default.object({
        type: joi_1.default.string().valid('invalidSessionId', 'invalidApiKey').required(),
        message: joi_1.default.string().allow('').required(),
    })),
}), joi_1.default.object({
    type: joi_1.default.string().valid('init').required(),
    payload: joi_1.default.object({
        sessionId: joi_1.default.string().required(),
        loginRawDigest: joi_1.default.string().hex().required(),
    }),
}), joi_1.default.object({
    type: joi_1.default.string().valid('login').required(),
    payload: joi_1.default.object({
        connectionString: joi_1.default.string().required(),
    }),
}), joi_1.default.object({
    type: joi_1.default.string().valid('message').required(),
}), joi_1.default.object({
    type: joi_1.default.string().valid('reconnect').required(),
}), joi_1.default.object({
    type: joi_1.default.string().valid('disconnect').required(),
}))
    .required());
exports.validateTezosBeaconResponse = validateTezosBeaconResponse;
const validateTezosBeaconEvent = (value) => (0, core_1.validateSchema)(value, joi_1.default.alternatives()
    .try(joi_1.default.object({
    type: joi_1.default.string().valid('message').required(),
    payload: joi_1.default.object({
        message: joi_1.default.string().required(),
    }),
}), joi_1.default.object({
    type: joi_1.default.string().valid('disconnect').required(),
}))
    .required());
exports.validateTezosBeaconEvent = validateTezosBeaconEvent;
const isPairingResponse = (value) => (0, core_1.validateType)(value, joi_1.default.object({
    type: joi_1.default.string().valid('p2p-pairing-response').required(),
    id: joi_1.default.string().required(),
    name: joi_1.default.string().required(),
    version: joi_1.default.string().required(),
    publicKey: joi_1.default.string().required(),
    relayServer: joi_1.default.string().required(),
    appUrl: joi_1.default.string().allow(''),
    icon: joi_1.default.string().allow(''),
}).required());
exports.isPairingResponse = isPairingResponse;
const isBaseMessage = (value) => (0, core_1.validateType)(value, joi_1.default.object({
    type: joi_1.default.string()
        .valid('permission_request', 'sign_payload_request', 'operation_request', 'broadcast_request', 'permission_response', 'sign_payload_response', 'operation_response', 'broadcast_response', 'disconnect', 'error', 'acknowledge')
        .required(),
    version: joi_1.default.string().required(),
    id: joi_1.default.string().required(),
    senderId: joi_1.default.string().required(),
})
    .options({ allowUnknown: true })
    .required());
exports.isBaseMessage = isBaseMessage;
const isPermissionResponse = (value) => (0, core_1.validateType)(value, joi_1.default.object({
    type: joi_1.default.string().valid('permission_response').required(),
    version: joi_1.default.string().required(),
    id: joi_1.default.string().required(),
    senderId: joi_1.default.string().required(),
    publicKey: joi_1.default.string().required(),
    network: joi_1.default.object({
        type: joi_1.default.string().valid('mainnet', 'carthagenet', 'custom', 'ghostnet').required(),
        name: joi_1.default.string().allow(''),
        rpcUrl: joi_1.default.string().allow(''),
    }).required(),
    scopes: joi_1.default.array()
        .items(joi_1.default.string().valid('sign', 'operation_request', 'threshold'))
        .required(),
    threshold: joi_1.default.object({
        amount: joi_1.default.string().required(),
        timeframe: joi_1.default.string().required(),
    }),
    appMetadata: joi_1.default.object({
        senderId: joi_1.default.string().required(),
        name: joi_1.default.string().required(),
        icon: joi_1.default.string().allow(''),
    }),
}).required());
exports.isPermissionResponse = isPermissionResponse;
const isOperationResponse = (value) => (0, core_1.validateType)(value, joi_1.default.object({
    type: joi_1.default.string().valid('operation_response').required(),
    version: joi_1.default.string().required(),
    id: joi_1.default.string().required(),
    senderId: joi_1.default.string().required(),
    transactionHash: joi_1.default.string().required(),
}).required());
exports.isOperationResponse = isOperationResponse;
const isSignPayloadResponse = (value) => (0, core_1.validateType)(value, joi_1.default.object({
    type: joi_1.default.string().valid('sign_payload_response').required(),
    version: joi_1.default.string().required(),
    id: joi_1.default.string().required(),
    senderId: joi_1.default.string().required(),
    signature: joi_1.default.string().required(),
    signingType: joi_1.default.string(),
}).required());
exports.isSignPayloadResponse = isSignPayloadResponse;
const isDisconnectMessage = (value) => (0, core_1.validateType)(value, joi_1.default.object({
    type: joi_1.default.string().valid('disconnect').required(),
    version: joi_1.default.string().required(),
    id: joi_1.default.string().required(),
    senderId: joi_1.default.string().required(),
}).required());
exports.isDisconnectMessage = isDisconnectMessage;
const isErrorResponse = (value) => (0, core_1.validateType)(value, joi_1.default.object({
    type: joi_1.default.string().valid('error').required(),
    version: joi_1.default.string().required(),
    id: joi_1.default.string().required(),
    senderId: joi_1.default.string().required(),
    errorType: joi_1.default.string()
        .valid('BROADCAST_ERROR', 'NETWORK_NOT_SUPPORTED', 'NO_ADDRESS_ERROR', 'NO_PRIVATE_KEY_FOUND_ERROR', 'NOT_GRANTED_ERROR', 'PARAMETERS_INVALID_ERROR', 'TOO_MANY_OPERATIONS', 'TRANSACTION_INVALID_ERROR', 'ABORTED_ERROR', 'UNKNOWN_ERROR')
        .required(),
}).required());
exports.isErrorResponse = isErrorResponse;
//# sourceMappingURL=validation.js.map