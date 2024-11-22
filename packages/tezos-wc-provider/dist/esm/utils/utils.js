import { isAndroid } from '@tconnect.io/dapp-utils';
export const getUniversalLink = (walletApp) => {
    switch (walletApp) {
        case 'kukai': {
            return `https://connect.kukai.app`;
        }
    }
};
export const getWalletConnectUniversalLink = (walletApp, walletConnectUri) => {
    let encodedUri = encodeURIComponent(walletConnectUri);
    if (isAndroid()) {
        encodedUri = encodeURIComponent(encodedUri);
    }
    switch (walletApp) {
        case 'kukai': {
            return `https://connect.kukai.app/wc?uri=${encodedUri}`;
        }
    }
};
//# sourceMappingURL=utils.js.map