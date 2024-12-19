"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTransactionAmount = exports.toIntegerString = exports.openLink = exports.randomUUID = exports.getErrorMessage = exports.getOperatingSystem = exports.isMobileSafari = exports.isAndroid = void 0;
const random_1 = require("@stablelib/random");
const ua_parser_js_1 = require("ua-parser-js");
const isAndroid = () => {
    const parser = new ua_parser_js_1.UAParser();
    return !!parser.getOS().name?.match(/android/i);
};
exports.isAndroid = isAndroid;
const isMobileSafari = () => {
    const parser = new ua_parser_js_1.UAParser();
    return !!parser.getBrowser().name?.match(/mobile safari/i);
};
exports.isMobileSafari = isMobileSafari;
const getOperatingSystem = () => {
    const parser = new ua_parser_js_1.UAParser();
    const os = parser.getOS().name;
    if (os?.match(/^Android(-x86)?$/)) {
        return 'android';
    }
    else if (os?.match(/^iOS$/)) {
        return 'ios';
    }
};
exports.getOperatingSystem = getOperatingSystem;
const getErrorMessage = (errorType, message) => {
    if (message) {
        return message;
    }
    switch (errorType) {
        case 'invalidApiKey': {
            return 'Invalid API key';
        }
        case 'invalidSessionId': {
            return 'Invalid session ID';
        }
        case 'walletRequestFailed': {
            return 'Wallet request failed';
        }
    }
};
exports.getErrorMessage = getErrorMessage;
const randomUUID = () => {
    const buf = (0, random_1.randomBytes)(16);
    return [buf.slice(0, 4), buf.slice(4, 6), buf.slice(6, 8), buf.slice(8, 10), buf.slice(10, 16)]
        .map(function (subbuf) {
        return Buffer.from(subbuf).toString('hex');
    })
        .join('-');
};
exports.randomUUID = randomUUID;
const openLink = async (link, options) => {
    if (typeof window !== 'undefined') {
        if (link.startsWith('https://')) {
            const webApp = await Promise.resolve().then(() => __importStar(require('@twa-dev/sdk')));
            webApp.default.openLink(link, options);
        }
        else {
            window.open(link);
        }
    }
};
exports.openLink = openLink;
const toIntegerString = (value) => BigInt(value).toString();
exports.toIntegerString = toIntegerString;
const formatTransactionAmount = (amount, mutez = false) => {
    if (mutez) {
        return BigInt(amount).toString();
    }
    return (BigInt(amount) * 10n ** 6n).toString();
};
exports.formatTransactionAmount = formatTransactionAmount;
//# sourceMappingURL=utils.js.map