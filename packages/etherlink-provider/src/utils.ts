import { isAndroid } from '@tconnect.io/dapp-utils';
import { EtherlinkWalletApp } from './types';

/**
 * Returns the universal link for the specified Etherlink wallet application.
 *
 * @param walletApp - The Etherlink wallet application for which to get the universal link.
 * @returns The universal link as a string.
 *
 * @example
 * ```typescript
 * const link = getUniversalLink('metaMask');
 * console.log(link); // Output: 'https://metamask.app.link'
 * ```
 */
export const getUniversalLink = (walletApp: EtherlinkWalletApp): string => {
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
			if (isAndroid()) {
				return 'trust://wc';
			} else {
				return 'https://link.trustwallet.com';
			}
		}
	}
};

/**
 * Generates a universal link for WalletConnect based on the specified wallet application and WalletConnect URI.
 *
 * @param walletApp - The wallet application for which the universal link is being generated.
 *                    Supported values are 'bitget', 'metaMask', 'safePal', and 'trust'.
 * @param connectionString - The WalletConnect URI to be encoded and included in the universal link.
 * @returns The universal link for the specified wallet application with the encoded WalletConnect URI.
 */
export const getConnectionStringUniversalLink = (walletApp: EtherlinkWalletApp, connectionString: string): string => {
	let encodedConnectionString = encodeURIComponent(connectionString);

	// Double encode for Android
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
			if (isAndroid()) {
				return `trust://wc?uri=${encodedConnectionString}`;
			} else {
				return `https://link.trustwallet.com/wc?uri=${encodedConnectionString}`;
			}
		}
	}
};
