"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateWrappedResponse = void 0;
const core_1 = require("@tconnect.io/core");
const joi_1 = __importDefault(require("joi"));
const validateWrappedResponse = (value) => (0, core_1.validateSchema)(value, joi_1.default.object({
    requestId: joi_1.default.string().uuid().required(),
    response: joi_1.default.any(),
}).required());
exports.validateWrappedResponse = validateWrappedResponse;
//# sourceMappingURL=validation.js.map