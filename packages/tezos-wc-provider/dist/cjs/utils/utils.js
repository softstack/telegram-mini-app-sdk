"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWalletConnectUniversalLink = exports.getUniversalLink = void 0;
const dapp_utils_1 = require("@tconnect.io/dapp-utils");
const getUniversalLink = (walletApp) => {
    switch (walletApp) {
        case 'kukai': {
            return `https://connect.kukai.app`;
        }
    }
};
exports.getUniversalLink = getUniversalLink;
const getWalletConnectUniversalLink = (walletApp, walletConnectUri) => {
    let encodedUri = encodeURIComponent(walletConnectUri);
    if ((0, dapp_utils_1.isAndroid)()) {
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