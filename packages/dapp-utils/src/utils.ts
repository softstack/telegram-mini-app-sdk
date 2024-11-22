import { EvmErrorType } from '@tconnect.io/evm-api-types';
import { TezosBeaconErrorType } from '@tconnect.io/tezos-beacon-api-types';
import { TezosWcErrorType } from '@tconnect.io/tezos-wc-api-types';
import { UAParser } from 'ua-parser-js';
import { OperatingSystem } from './types';

/**
 * Determines if the current operating system is Android.
 *
 * @returns {boolean} `true` if the operating system is Android, otherwise `false`.
 */
export const isAndroid = (): boolean => {
	const parser = new UAParser();
	return !!parser.getOS().name?.match(/android/i);
};

/**
 * Checks if the current browser is Mobile Safari.
 *
 * This function uses the UAParser library to parse the user agent string
 * and determine if the browser is Mobile Safari.
 *
 * @returns {boolean} `true` if the browser is Mobile Safari, otherwise `false`.
 */
export const isMobileSafari = (): boolean => {
	const parser = new UAParser();
	return !!parser.getBrowser().name?.match(/mobile safari/i);
};

/**
 * Determines the operating system of the user's device.
 *
 * @returns {OperatingSystem | undefined} The operating system, either 'android' or 'ios', or undefined if the OS is not recognized.
 */
export const getOperatingSystem = (): OperatingSystem | undefined => {
	const parser = new UAParser();
	const os = parser.getOS().name;
	if (os?.match(/^Android(-x86)?$/)) {
		return 'android';
	} else if (os?.match(/^iOS$/)) {
		return 'ios';
	}
};

/**
 * Returns a specific error message based on the provided error type and message.
 *
 * @param errorType - The type of error, excluding 'generic'.
 * @param message - The custom error message to return if provided.
 * @returns The error message string.
 *
 * @remarks
 * If a custom message is provided, it will be returned. Otherwise, a predefined message
 * based on the error type will be returned.
 *
 * @example
 * ```typescript
 * const errorMessage = getErrorMessage('invalidApiKey', '');
 * console.log(errorMessage); // Output: 'Invalid API key'
 * ```
 */
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
