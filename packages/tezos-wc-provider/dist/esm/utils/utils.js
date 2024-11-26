import { isAndroid } from '@tconnect.io/dapp-utils';
export const getUniversalLink = (walletApp) => {
    switch (walletApp) {
        case 'kukai': {
            return `https://connect.kukai.app`;
        }
    }
};
export const getConnectionStringUniversalLink = (walletApp, connectionString) => {
    let encodedConnectionString = encodeURIComponent(connectionString);
    if (isAndroid()) {
        encodedConnectionString = encodeURIComponent(encodedConnectionString);
    }
    switch (walletApp) {
        case 'kukai': {
            return `https://connect.kukai.app/wc?uri=${encodedConnectionString}`;
        }
    }
};
//# sourceMappingURL=utils.js.map