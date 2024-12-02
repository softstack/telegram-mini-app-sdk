import { isAndroid } from '@tconnect.io/dapp-utils';
import { EvmWalletApp } from './types';

/**
 * Returns the universal link for the specified EVM wallet application.
 *
 * @param walletApp - The EVM wallet application for which to get the universal link.
 * @returns The universal link as a string.
 *
 * @example
 * ```typescript
 * const link = getUniversalLink('metaMask');
 * console.log(link); // Output: 'https://metamask.app.link'
 * ```
 */
export const getUniversalLink = (walletApp: EvmWalletApp): string => {
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

/**
 * Generates a universal link for WalletConnect based on the specified wallet application and WalletConnect URI.
 *
 * @param walletApp - The wallet application for which the universal link is being generated.
 *                    Supported values are 'bitget', 'metaMask', 'rainbow', 'safePal', and 'trust'.
 * @param connectionString - The WalletConnect URI to be encoded and included in the universal link.
 * @returns The universal link for the specified wallet application with the encoded WalletConnect URI.
 */
export const getConnectionStringUniversalLink = (
	walletApp: EvmWalletApp,
	connectionString: string,
	bridgeUrl: string,
): string => {
	let encodedUri = encodeURIComponent(connectionString);

	// Double encode for Android
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
