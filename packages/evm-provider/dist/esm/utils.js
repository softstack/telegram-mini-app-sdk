import { isAndroid } from '@tconnect.io/dapp-utils';
export const getUniversalLink = (walletApp) => {
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
        case 'test-wallet': {
            return '';
        }
        case 'trust': {
            return 'https://link.trustwallet.com';
        }
    }
};
export const getConnectionStringUniversalLink = (walletApp, connectionString, bridgeUrl) => {
    let encodedUri = encodeURIComponent(connectionString);
    if (isAndroid()) {
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
        case 'test-wallet': {
            return `${bridgeUrl}/api/v1/evm-test-wallet/wc?uri=${encodedUri}`;
        }
        case 'trust': {
            return `https://link.trustwallet.com/wc?uri=${encodedUri}`;
        }
    }
};
//# sourceMappingURL=utils.js.map