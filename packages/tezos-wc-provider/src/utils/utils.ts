import { isAndroid } from '@tconnect.io/dapp-utils';
import { TezosWcWalletApp } from '../types';

export const getUniversalLink = (walletApp: TezosWcWalletApp): string => {
	switch (walletApp) {
		case 'kukai': {
			return `https://connect.kukai.app`;
		}
	}
};

export const getWalletConnectUniversalLink = (walletApp: TezosWcWalletApp, walletConnectUri: string): string => {
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
