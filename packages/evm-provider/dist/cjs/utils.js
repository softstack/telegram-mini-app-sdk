"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWalletConnectUniversalLink = exports.getUniversalLink = void 0;
const browser_utils_1 = require("@tconnect.io/browser-utils");
const getUniversalLink = (walletApp) => {
    switch (walletApp) {
        case 'bitget': {
            return 'https://bkapp.vip';
        }
        case 'metaMask': {
            return 'https://metamask.app.link';
        }
        case 'rainbow': {
            return 'https://rnbwapp.com';
        }
        case 'safePal': {
            return 'https://link.safepal.io';
        }
        case 'trust': {
            return 'https://link.trustwallet.com';
        }
    }
};
exports.getUniversalLink = getUniversalLink;
const getWalletConnectUniversalLink = (walletApp, walletConnectUri) => {
    let encodedUri = encodeURIComponent(walletConnectUri);
    // Double encode for Android
    if ((0, browser_utils_1.isAndroid)()) {
        encodedUri = encodeURIComponent(encodedUri);
    }
    switch (walletApp) {
        case 'bitget': {
            return `https://bkapp.vip/wc?uri=${encodedUri}`;
        }
        case 'metaMask': {
            return `https://metamask.app.link/wc?uri=${encodedUri}`;
        }
        case 'rainbow': {
            return `https://rnbwapp.com/wc?uri=${encodedUri}`;
        }
        case 'safePal': {
            return `https://link.safepal.io/wc?uri=${encodedUri}`;
        }
        case 'trust': {
            return `https://link.trustwallet.com/wc?uri=${encodedUri}`;
        }
    }
};
exports.getWalletConnectUniversalLink = getWalletConnectUniversalLink;
//# sourceMappingURL=utils.js.map