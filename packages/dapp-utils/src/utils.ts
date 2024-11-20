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
