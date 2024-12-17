"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnectionStringUniversalLink = exports.getUniversalLink = void 0;
const dapp_utils_1 = require("@tconnect.io/dapp-utils");
const getUniversalLink = (walletApp) => {
    switch (walletApp) {
        case 'kukai': {
            return 'https://connect.kukai.app';
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
        case 'kukai': {
            return `https://connect.kukai.app/wc?uri=${encodedConnectionString}`;
        }
    }
};
exports.getConnectionStringUniversalLink = getConnectionStringUniversalLink;
//# sourceMappingURL=utils.js.map