"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnectionStringUniversalLink = exports.getUniversalLink = void 0;
const dapp_utils_1 = require("@tconnect.io/dapp-utils");
const getUniversalLink = (walletApp) => {
    switch (walletApp) {
        case 'bitget': {
            return 'bitkeep://wc';
        }
        case 'metaMask': {
            return 'https://metamask.app.link';
        }
        case 'safePal': {
            return 'https://link.safepal.io';
        }
        case 'trust': {
            if ((0, dapp_utils_1.isAndroid)()) {
                return 'trust://wc';
            }
            else {
                return 'https://link.trustwallet.com';
            }
        }
    }
};
exports.getUniversalLink = getUniversalLink;
const getConnectionStringUniversalLink = (walletApp, connectionString) => {
    let encodedConnectionString = encodeURIComponent(connectionString);
    if ((0, dapp_utils_1.isAndroid)()) {
        encodedConnectionString = encodeURIComponent(encodedConnectionString);
    }
    switch (walletApp) {
        case 'bitget': {
            return `https://bkapp.vip/wc?uri=${encodedConnectionString}`;
        }
        case 'metaMask': {
            return `https://metamask.app.link/wc?uri=${encodedConnectionString}`;
        }
        case 'safePal': {
            return `https://link.safepal.io/wc?uri=${encodedConnectionString}`;
        }
        case 'trust': {
            if ((0, dapp_utils_1.isAndroid)()) {
                return `trust://wc?uri=${encodedConnectionString}`;
            }
            else {
                return `https://link.trustwallet.com/wc?uri=${encodedConnectionString}`;
            }
        }
    }
};
exports.getConnectionStringUniversalLink = getConnectionStringUniversalLink;
//# sourceMappingURL=utils.js.map