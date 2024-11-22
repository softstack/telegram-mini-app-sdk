import { KeyPair } from '@stablelib/ed25519';
import { SessionKeys } from '@stablelib/x25519-session';
import { TezosBeaconWalletApp } from '../types';
export declare const isHex: (value: string) => boolean;
export declare const toHex: (value: Uint8Array | string) => string;
export declare const getHexHash: (key: string | Buffer | Uint8Array) => string;
export declare const getAddressFromPublicKey: (publicKey: string) => string;
export declare const openCryptobox: (encryptedPayload: string | Buffer, publicKey: Uint8Array, privateKey: Uint8Array) => string;
export declare const createCryptoBoxServer: (otherPublicKey: string, selfKeypair: KeyPair) => SessionKeys;
export declare const createCryptoBoxClient: (otherPublicKey: string, selfKeypair: KeyPair) => SessionKeys;
export declare const getSenderId: (publicKey: string) => string;
export declare const encryptCryptoboxPayload: (message: string, sharedKey: Uint8Array) => string;
export declare const decryptCryptoboxPayload: (payload: Uint8Array, sharedKey: Uint8Array) => string;
export declare const getUniversalLink: (walletApp: TezosBeaconWalletApp) => string | undefined;
export declare const getConnectionStringUniversalLink: (walletApp: TezosBeaconWalletApp, connectionString: string, genericWalletUrl: string) => string;
export declare const isUniversalLinkWallet: (walletApp: TezosBeaconWalletApp) => boolean;
