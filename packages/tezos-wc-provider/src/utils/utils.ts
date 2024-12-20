import { isAndroid } from '@tconnect.io/dapp-utils';
import { TezosWcWalletApp } from '../types';

/**
 * Generates a universal link for the specified Tezos wallet application.
 *
 * @param walletApp - The Tezos wallet application for which to generate the universal link.
 * @returns The universal link for the specified wallet application.
 */
export const getUniversalLink = (walletApp: TezosWcWalletApp): string => {
	switch (walletApp) {
		case 'kukai': {
			return 'https://connect.kukai.app';
		}
	}
};

/**
 * Generates a universal link for WalletConnect based on the specified wallet application and WalletConnect URI.
 *
 * @param walletApp - The wallet application to generate the link for. Currently supports 'kukai'.
 * @param connectionString - The WalletConnect URI to be encoded and included in the universal link.
 * @returns The universal link for the specified wallet application.
 */
export const getConnectionStringUniversalLink = (walletApp: TezosWcWalletApp, connectionString: string): string => {
	let encodedConnectionString = encodeURIComponent(connectionString);

	// Double encode for Android
	if (isAndroid()) {
		encodedConnectionString = encodeURIComponent(encodedConnectionString);
	}

	switch (walletApp) {
		case 'kukai': {
			return `https://connect.kukai.app/wc?uri=${encodedConnectionString}`;
		}
	}
};
