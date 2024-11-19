import { isAndroid } from '@tconnect.io/browser-utils';
export const getWalletConnectUniversalLink = (walletApp, walletConnectUri) => {
    let encodedUri = encodeURIComponent(walletConnectUri);
    // Double encode for Android
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