import { randomBytes } from '@stablelib/random';
import { EtherlinkErrorType } from '@tconnect.io/etherlink-api-types';
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
	errorType: Exclude<EtherlinkErrorType | TezosBeaconErrorType | TezosWcErrorType, 'generic'>,
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

export const randomUUID = (): string => {
	const buf = randomBytes(16);
	return [buf.slice(0, 4), buf.slice(4, 6), buf.slice(6, 8), buf.slice(8, 10), buf.slice(10, 16)]
		.map(function (subbuf) {
			return Buffer.from(subbuf).toString('hex');
		})
		.join('-');
};

export const openLink = async (link: string, options?: { try_instant_view: boolean }): Promise<void> => {
	// eslint-disable-next-line unicorn/prefer-global-this
	if (typeof window !== 'undefined') {
		if (link.startsWith('https://')) {
			const webApp = await import('@twa-dev/sdk');
			webApp.default.openLink(link, options);
		} else {
			window.open(link);
		}
	}
};

/**
 * Converts a given value to its integer string representation.
 *
 * @param value - The value to be converted, which can be of type bigint, number, or string.
 * @returns The integer string representation of the given value.
 */
export const toIntegerString = (value: bigint | number | string): string => BigInt(value).toString();

/**
 * Formats a transaction amount.
 *
 * @param amount - The amount to format.
 * @param mutez - A boolean indicating whether the amount is in mutez (smallest unit of Tezos).
 *                If true, the amount is returned as is. If false, the amount is converted to mutez.
 * @returns The formatted transaction amount as a string.
 */
export const formatTransactionAmount = (amount: number, mutez = false): string => {
	if (mutez) {
		return BigInt(amount).toString();
	}
	return (BigInt(amount) * 10n ** 6n).toString();
};
