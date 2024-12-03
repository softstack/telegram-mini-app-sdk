"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomUUID = exports.getErrorMessage = exports.getOperatingSystem = exports.isMobileSafari = exports.isAndroid = void 0;
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
//# sourceMappingURL=utils.js.map