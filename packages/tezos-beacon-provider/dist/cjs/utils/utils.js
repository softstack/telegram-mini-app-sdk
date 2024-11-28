"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUniversalLinkWallet = exports.getConnectionStringUniversalLink = exports.getUniversalLink = exports.decryptCryptoboxPayload = exports.encryptCryptoboxPayload = exports.getSenderId = exports.createCryptoBoxClient = exports.createCryptoBoxServer = exports.openCryptobox = exports.getAddressFromPublicKey = exports.getHexHash = exports.toHex = exports.isHex = void 0;
const blake2b_1 = require("@stablelib/blake2b");
const ed25519_1 = require("@stablelib/ed25519");
const nacl_1 = require("@stablelib/nacl");
const utf8_1 = require("@stablelib/utf8");
const x25519_session_1 = require("@stablelib/x25519-session");
const tezos_beacon_api_types_1 = require("@tconnect.io/tezos-beacon-api-types");
const bs58check_1 = __importDefault(require("bs58check"));
const isHex = (value) => /^[\da-f]+$/i.test(value);
exports.isHex = isHex;
const toHex = (value) => Buffer.from(value).toString('hex');
exports.toHex = toHex;
const getHexHash = (key) => {
    if (typeof key === 'string') {
        return (0, exports.toHex)((0, blake2b_1.hash)((0, utf8_1.encode)(key), 32));
    }
    return (0, exports.toHex)((0, blake2b_1.hash)(key, 32));
};
exports.getHexHash = getHexHash;
const getAddressFromPublicKey = (publicKey) => {
    const prefixes = {
        edpk: {
            length: 54,
            prefix: Buffer.from(new Uint8Array([6, 161, 159])),
        },
        sppk: {
            length: 55,
            prefix: Buffer.from(new Uint8Array([6, 161, 161])),
        },
        p2pk: {
            length: 55,
            prefix: Buffer.from(new Uint8Array([6, 161, 164])),
        },
    };
    let prefix;
    let plainPublicKey;
    if (publicKey.length === 64) {
        prefix = prefixes.edpk.prefix;
        plainPublicKey = publicKey;
    }
    else {
        const entries = Object.entries(prefixes);
        for (const [key, value] of entries) {
            if (publicKey.startsWith(key) && publicKey.length === value.length) {
                prefix = value.prefix;
                const decoded = bs58check_1.default.decode(publicKey);
                plainPublicKey = Buffer.from(decoded.slice(key.length)).toString('hex');
                break;
            }
        }
    }
    if (!prefix || !plainPublicKey) {
        throw new Error(`invalid publicKey: ${publicKey}`);
    }
    const payload = (0, blake2b_1.hash)(Buffer.from(plainPublicKey, 'hex'), 20);
    return bs58check_1.default.encode(Buffer.concat([prefix, Buffer.from(payload)]));
};
exports.getAddressFromPublicKey = getAddressFromPublicKey;
const openCryptobox = (encryptedPayload, publicKey, privateKey) => {
    const kxSelfPrivateKey = (0, ed25519_1.convertSecretKeyToX25519)(Buffer.from(privateKey));
    const kxSelfPublicKey = (0, ed25519_1.convertPublicKeyToX25519)(Buffer.from(publicKey));
    const bytesPayload = typeof encryptedPayload === 'string' ? (0, utf8_1.encode)(encryptedPayload) : encryptedPayload;
    const epk = bytesPayload.slice(0, 32);
    const ciphertext = bytesPayload.slice(32);
    const state = new blake2b_1.BLAKE2b(24);
    const nonce = state.update(epk, 32).update(kxSelfPublicKey, 32).digest();
    const decryptedMessage2 = (0, nacl_1.openBox)(epk, kxSelfPrivateKey, nonce, ciphertext);
    if (!decryptedMessage2) {
        throw new Error('Decryption failed');
    }
    return Buffer.from(decryptedMessage2).toString();
};
exports.openCryptobox = openCryptobox;
const createCryptoBoxServer = (otherPublicKey, selfKeypair) => (0, x25519_session_1.serverSessionKeys)({
    publicKey: (0, ed25519_1.convertPublicKeyToX25519)(selfKeypair.publicKey),
    secretKey: (0, ed25519_1.convertSecretKeyToX25519)(selfKeypair.secretKey),
}, (0, ed25519_1.convertPublicKeyToX25519)(Buffer.from(otherPublicKey, 'hex')));
exports.createCryptoBoxServer = createCryptoBoxServer;
const createCryptoBoxClient = (otherPublicKey, selfKeypair) => (0, x25519_session_1.clientSessionKeys)({
    publicKey: (0, ed25519_1.convertPublicKeyToX25519)(selfKeypair.publicKey),
    secretKey: (0, ed25519_1.convertSecretKeyToX25519)(selfKeypair.secretKey),
}, (0, ed25519_1.convertPublicKeyToX25519)(Buffer.from(otherPublicKey, 'hex')));
exports.createCryptoBoxClient = createCryptoBoxClient;
const getSenderId = (publicKey) => {
    if (!(0, exports.isHex)(publicKey)) {
        console.error('PublicKey needs to be in hex format!');
    }
    const buffer = Buffer.from((0, blake2b_1.hash)(Buffer.from(publicKey, 'hex'), 5));
    return bs58check_1.default.encode(buffer);
};
exports.getSenderId = getSenderId;
const encryptCryptoboxPayload = (message, sharedKey) => {
    const nonce = Buffer.from(crypto.getRandomValues(new Uint8Array(tezos_beacon_api_types_1.secretbox_NONCEBYTES)));
    const combinedPayload = Buffer.concat([
        nonce,
        Buffer.from((0, nacl_1.secretBox)(sharedKey, nonce, Buffer.from(message, 'utf8'))),
    ]);
    return (0, exports.toHex)(combinedPayload);
};
exports.encryptCryptoboxPayload = encryptCryptoboxPayload;
const decryptCryptoboxPayload = (payload, sharedKey) => {
    const nonce = payload.slice(0, tezos_beacon_api_types_1.secretbox_NONCEBYTES);
    const ciphertext = payload.slice(tezos_beacon_api_types_1.secretbox_NONCEBYTES);
    const openBox = (0, nacl_1.openSecretBox)(sharedKey, nonce, ciphertext);
    if (!openBox) {
        throw new Error('Decryption failed');
    }
    return Buffer.from(openBox).toString('utf8');
};
exports.decryptCryptoboxPayload = decryptCryptoboxPayload;
const getUniversalLink = (walletApp) => {
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
exports.getUniversalLink = getUniversalLink;
const getConnectionStringUniversalLink = (walletApp, connectionString) => {
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
    }
};
exports.getConnectionStringUniversalLink = getConnectionStringUniversalLink;
const isUniversalLinkWallet = (walletApp) => {
    switch (walletApp) {
        case 'altme':
        case 'kukai':
        case 'temple': {
            return true;
        }
    }
    return false;
};
exports.isUniversalLinkWallet = isUniversalLinkWallet;
//# sourceMappingURL=utils.js.map