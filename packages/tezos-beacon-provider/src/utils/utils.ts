import { BLAKE2b, hash } from '@stablelib/blake2b';
import { convertPublicKeyToX25519, convertSecretKeyToX25519, KeyPair } from '@stablelib/ed25519';
import { openBox, openSecretBox, secretBox } from '@stablelib/nacl';
import { encode } from '@stablelib/utf8';
import { clientSessionKeys, serverSessionKeys, SessionKeys } from '@stablelib/x25519-session';
import { secretbox_NONCEBYTES } from '@tconnect.io/tezos-beacon-api-types';
import bs58check from 'bs58check';
import { TezosBeaconWalletApp } from '../types';

export const isHex = (value: string): boolean => /^[\da-f]+$/i.test(value);

export const toHex = (value: Uint8Array | string): string => Buffer.from(value).toString('hex');

export const getHexHash = (key: string | Buffer | Uint8Array): string => {
	if (typeof key === 'string') {
		return toHex(hash(encode(key), 32));
	}
	return toHex(hash(key, 32));
};

export const getAddressFromPublicKey = (publicKey: string): string => {
	const prefixes = {
		// tz1...
		edpk: {
			length: 54,
			prefix: Buffer.from(new Uint8Array([6, 161, 159])),
		},
		// tz2...
		sppk: {
			length: 55,
			prefix: Buffer.from(new Uint8Array([6, 161, 161])),
		},
		// tz3...
		p2pk: {
			length: 55,
			prefix: Buffer.from(new Uint8Array([6, 161, 164])),
		},
	};
	let prefix: Buffer | undefined;
	let plainPublicKey: string | undefined;
	if (publicKey.length === 64) {
		prefix = prefixes.edpk.prefix;
		plainPublicKey = publicKey;
	} else {
		const entries = Object.entries(prefixes);
		for (const [key, value] of entries) {
			if (publicKey.startsWith(key) && publicKey.length === value.length) {
				prefix = value.prefix;
				const decoded = bs58check.decode(publicKey);
				plainPublicKey = Buffer.from(decoded.slice(key.length)).toString('hex');
				break;
			}
		}
	}
	if (!prefix || !plainPublicKey) {
		throw new Error(`invalid publicKey: ${publicKey}`);
	}
	const payload: Uint8Array = hash(Buffer.from(plainPublicKey, 'hex'), 20);
	return bs58check.encode(Buffer.concat([prefix, Buffer.from(payload)]));
};

export const openCryptobox = (
	encryptedPayload: string | Buffer,
	publicKey: Uint8Array,
	privateKey: Uint8Array,
): string => {
	const kxSelfPrivateKey = convertSecretKeyToX25519(Buffer.from(privateKey)); // Secret bytes to scalar bytes
	const kxSelfPublicKey = convertPublicKeyToX25519(Buffer.from(publicKey)); // Secret bytes to scalar bytes
	const bytesPayload = typeof encryptedPayload === 'string' ? encode(encryptedPayload) : encryptedPayload;
	const epk = bytesPayload.slice(0, 32);
	const ciphertext = bytesPayload.slice(32);
	const state = new BLAKE2b(24);
	const nonce = state.update(epk, 32).update(kxSelfPublicKey, 32).digest();
	const decryptedMessage2 = openBox(epk, kxSelfPrivateKey, nonce, ciphertext);
	if (!decryptedMessage2) {
		throw new Error('Decryption failed');
	}
	return Buffer.from(decryptedMessage2).toString();
};

export const createCryptoBoxServer = (otherPublicKey: string, selfKeypair: KeyPair): SessionKeys =>
	serverSessionKeys(
		{
			publicKey: convertPublicKeyToX25519(selfKeypair.publicKey),
			secretKey: convertSecretKeyToX25519(selfKeypair.secretKey),
		},
		convertPublicKeyToX25519(Buffer.from(otherPublicKey, 'hex')),
	);

export const createCryptoBoxClient = (otherPublicKey: string, selfKeypair: KeyPair): SessionKeys =>
	clientSessionKeys(
		{
			publicKey: convertPublicKeyToX25519(selfKeypair.publicKey),
			secretKey: convertSecretKeyToX25519(selfKeypair.secretKey),
		},
		convertPublicKeyToX25519(Buffer.from(otherPublicKey, 'hex')),
	);

export const getSenderId = (publicKey: string): string => {
	if (!isHex(publicKey)) {
		console.error('PublicKey needs to be in hex format!');
	}
	const buffer = Buffer.from(hash(Buffer.from(publicKey, 'hex'), 5));
	return bs58check.encode(buffer);
};

export const encryptCryptoboxPayload = (message: string, sharedKey: Uint8Array): string => {
	const nonce = Buffer.from(crypto.getRandomValues(new Uint8Array(secretbox_NONCEBYTES)));
	const combinedPayload = Buffer.concat([
		nonce,
		Buffer.from(secretBox(sharedKey, nonce, Buffer.from(message, 'utf8'))),
	]);
	return toHex(combinedPayload);
};

export const decryptCryptoboxPayload = (payload: Uint8Array, sharedKey: Uint8Array): string => {
	const nonce = payload.slice(0, secretbox_NONCEBYTES);
	const ciphertext = payload.slice(secretbox_NONCEBYTES);
	const openBox = openSecretBox(sharedKey, nonce, ciphertext);
	if (!openBox) {
		throw new Error('Decryption failed');
	}
	return Buffer.from(openBox).toString('utf8');
};

export const getUniversalLink = (walletApp: TezosBeaconWalletApp): string | undefined => {
	switch (walletApp) {
		case 'altme': {
			return 'https://app.altme.io/app/download';
		}
		case 'kukai': {
			return 'https://connect.kukai.app';
		}
		case 'temple': {
			return 'https://app.templewallet.com';
		}
	}
};

export const getConnectionStringUniversalLink = (
	walletApp: TezosBeaconWalletApp,
	connectionString: string,
	genericWalletUrl: string,
): string => {
	// let encodedConnectionString = encodeURIComponent(connectionString);

	// // Double encode for Android
	// if (isAndroid() && walletApp !== '_generic_') {
	// 	encodedConnectionString = encodeURIComponent(encodedConnectionString);
	// }

	switch (walletApp) {
		case 'altme': {
			return `https://app.altme.io/app/download?${connectionString.slice(9)}`;
		}
		case 'kukai': {
			return `https://connect.kukai.app?${connectionString.slice(9)}`;
		}
		case 'temple': {
			return `https://app.templewallet.com?${connectionString.slice(9)}`;
		}
		case '_generic_': {
			const url = new URL(genericWalletUrl);
			url.searchParams.append('uri', connectionString);
			return url.toString();
		}
	}
};

export const isUniversalLinkWallet = (walletApp: TezosBeaconWalletApp): boolean => {
	switch (walletApp) {
		case 'altme':
		case 'kukai': {
			return true;
		}
	}
	return false;
};
