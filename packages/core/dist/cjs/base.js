"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toEventListener = exports.joinUrl = exports.sleep = exports.hasOwnProperty = void 0;
const hasOwnProperty = (object, property) => Object.prototype.hasOwnProperty.call(object, property);
exports.hasOwnProperty = hasOwnProperty;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
exports.sleep = sleep;
const joinUrl = (...parts) => {
    let url = '';
    for (let part of parts) {
        if (url) {
            if (url.endsWith('/')) {
                url = url.slice(0, -1);
            }
            if (part.startsWith('/')) {
                part = part.slice(1);
            }
            url = `${url}/${part}`;
        }
        else {
            url = part;
        }
    }
    return url;
};
exports.joinUrl = joinUrl;
const toEventListener = (handler) => (event) => {
    handler(event.detail);
};
exports.toEventListener = toEventListener;
//# sourceMappingURL=base.js.map