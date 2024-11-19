"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWalletConnectUniversalLink = void 0;
const browser_utils_1 = require("@tconnect.io/browser-utils");
const getWalletConnectUniversalLink = (walletApp, walletConnectUri) => {
    let encodedUri = encodeURIComponent(walletConnectUri);
    // Double encode for Android
    if ((0, browser_utils_1.isAndroid)()) {
        encodedUri = encodeURIComponent(encodedUri);
    }
    switch (walletApp) {
        case 'kukai': {
            return `https://connect.kukai.app/wc?uri=${encodedUri}`;
        }
    }
};
exports.getWalletConnectUniversalLink = getWalletConnectUniversalLink;
//# sourceMappingURL=utils.js.map