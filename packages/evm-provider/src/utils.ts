import { isAndroid } from '@tconnect.io/dapp-utils';
import { EvmWalletApp } from './types';

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
		case 'trust': {
			return 'https://link.trustwallet.com';
		}
	}
};

export const getWalletConnectUniversalLink = (walletApp: EvmWalletApp, walletConnectUri: string): string => {
	let encodedUri = encodeURIComponent(walletConnectUri);

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
		case 'trust': {
			return `https://link.trustwallet.com/wc?uri=${encodedUri}`;
		}
	}
};
