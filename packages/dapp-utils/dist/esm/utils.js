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
//# sourceMappingURL=utils.js.map