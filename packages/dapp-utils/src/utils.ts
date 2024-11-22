import { EvmErrorType } from '@tconnect.io/evm-api-types';
import { TezosBeaconErrorType } from '@tconnect.io/tezos-beacon-api-types';
import { TezosWcErrorType } from '@tconnect.io/tezos-wc-api-types';
import { UAParser } from 'ua-parser-js';
import { OperatingSystem } from './types';

export const isAndroid = (): boolean => {
	const parser = new UAParser();
	return !!parser.getOS().name?.match(/android/i);
};

export const isMobileSafari = (): boolean => {
	const parser = new UAParser();
	return !!parser.getBrowser().name?.match(/mobile safari/i);
};

export const getOperatingSystem = (): OperatingSystem | undefined => {
	const parser = new UAParser();
	const os = parser.getOS().name;
	if (os?.match(/^Android(-x86)?$/)) {
		return 'android';
	} else if (os?.match(/^iOS$/)) {
		return 'ios';
	}
};

export const getErrorMessage = (
	errorType: Exclude<EvmErrorType | TezosBeaconErrorType | TezosWcErrorType, 'generic'>,
	message: string,
): string => {
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
