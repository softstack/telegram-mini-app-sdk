import { isAndroid } from '@tconnect.io/dapp-utils';
export const getUniversalLink = (walletApp) => {
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
            return 'trust://wc';
        }
    }
};
export const getConnectionStringUniversalLink = (walletApp, connectionString) => {
    let encodedConnectionString = encodeURIComponent(connectionString);
    if (isAndroid()) {
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
            return `trust://wc?uri=${encodedConnectionString}`;
        }
    }
};
//# sourceMappingURL=utils.js.map