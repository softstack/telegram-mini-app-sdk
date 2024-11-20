"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOperatingSystem = exports.isMobileSafari = exports.isAndroid = void 0;
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
//# sourceMappingURL=utils.js.map