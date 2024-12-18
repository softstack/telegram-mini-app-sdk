import { randomBytes } from '@stablelib/random';
import { UAParser } from 'ua-parser-js';
export const isAndroid = () => {
    const parser = new UAParser();
    return !!parser.getOS().name?.match(/android/i);
};
export const isMobileSafari = () => {
    const parser = new UAParser();
    return !!parser.getBrowser().name?.match(/mobile safari/i);
};
export const getOperatingSystem = () => {
    const parser = new UAParser();
    const os = parser.getOS().name;
    if (os?.match(/^Android(-x86)?$/)) {
        return 'android';
    }
    else if (os?.match(/^iOS$/)) {
        return 'ios';
    }
};
export const getErrorMessage = (errorType, message) => {
    if (message) {
        return message;
    }
    switch (errorType) {
        case 'invalidApiKey': {
            return 'Invalid API key';
        }
        case 'invalidSessionId': {
            return 'Invalid session ID';
        }
        case 'walletRequestFailed': {
            return 'Wallet request failed';
        }
    }
};
export const randomUUID = () => {
    const buf = randomBytes(16);
    return [buf.slice(0, 4), buf.slice(4, 6), buf.slice(6, 8), buf.slice(8, 10), buf.slice(10, 16)]
        .map(function (subbuf) {
        return Buffer.from(subbuf).toString('hex');
    })
        .join('-');
};
export const openLink = async (link, options) => {
    if (typeof window !== 'undefined') {
        if (link.startsWith('https://')) {
            const webApp = await import('@twa-dev/sdk');
            webApp.default.openLink(link, options);
        }
        else {
            window.open(link);
        }
    }
};
export const toIntegerString = (value) => BigInt(value).toString();
export const formatTransactionAmount = (amount, mutez = false) => {
    if (mutez) {
        return BigInt(amount).toString();
    }
    return (BigInt(amount) * 10n ** 6n).toString();
};
//# sourceMappingURL=utils.js.map