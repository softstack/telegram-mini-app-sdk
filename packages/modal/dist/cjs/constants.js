"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADD_ETHERLINK_GHOSTNET_URL = exports.ADD_ETHERLINK_MAINNET_URL = exports.TOAST_CONTAINER_ID = exports.ETHERLINK_GHOSTNET_DETAILS = exports.ETHERLINK_MAINNET_DETAILS = exports.NETWORKS = exports.TEZOS_WC_PROVIDER_STORAGE_KEY = exports.TEZOS_BEACON_PROVIDER_STORAGE_KEY = exports.EVM_PROVIDER_STORAGE_KEY = exports.TAILWIND_PREFIX = void 0;
exports.TAILWIND_PREFIX = 'eotrzpirnbqlbfjhbqpo-';
exports.EVM_PROVIDER_STORAGE_KEY = 'evvcswyjarnlkwvdlrfr';
exports.TEZOS_BEACON_PROVIDER_STORAGE_KEY = 'jkdkvddgajorkvmywwub';
exports.TEZOS_WC_PROVIDER_STORAGE_KEY = 'nxmhhphkvgwzhmifdyus';
exports.NETWORKS = [
    {
        type: 'evm',
        name: 'Etherlink',
        icon: 'etherlink',
        wallets: [
            {
                name: 'Bitget',
                icon: 'bitget',
                network: 'evm',
                walletApp: 'bitget',
                addEtherlinkUrl: '',
                supportedOperatingSystems: ['android', 'ios'],
            },
            {
                name: 'MetaMask',
                icon: 'metaMask',
                network: 'evm',
                walletApp: 'metaMask',
                addEtherlinkUrl: '',
                supportedOperatingSystems: ['android', 'ios'],
            },
            {
                name: 'SafePal',
                icon: 'safePal',
                network: 'evm',
                walletApp: 'safePal',
                addEtherlinkUrl: '',
                supportedOperatingSystems: ['android', 'ios'],
            },
            {
                name: 'Trust',
                icon: 'trust',
                network: 'evm',
                walletApp: 'trust',
                addEtherlinkUrl: '',
                supportedOperatingSystems: ['android', 'ios'],
            },
        ],
    },
    {
        type: 'tezos',
        name: 'Tezos',
        icon: 'tezos',
        wallets: [
            {
                name: 'Altme',
                icon: 'altme',
                network: 'tezos',
                bridge: 'beacon',
                walletApp: 'altme',
                supportedOperatingSystems: ['android', 'ios'],
            },
            {
                name: 'Kukai',
                icon: 'kukai',
                network: 'tezos',
                bridge: 'wc',
                walletApp: 'kukai',
                supportedOperatingSystems: ['ios'],
            },
            {
                name: 'Temple',
                icon: 'temple',
                network: 'tezos',
                bridge: 'beacon',
                walletApp: 'temple',
                supportedOperatingSystems: ['android', 'ios'],
            },
        ],
    },
];
exports.ETHERLINK_MAINNET_DETAILS = [
    { label: 'Network Name', value: 'Etherlink Mainnet' },
    { label: 'Chain ID', value: '42793' },
    { label: 'Symbol', value: 'XTZ' },
    { label: 'RPC URL', value: 'https://node.mainnet.etherlink.com' },
    { label: 'Block Explorer URL', value: 'https://explorer.etherlink.com' },
];
exports.ETHERLINK_GHOSTNET_DETAILS = [
    { label: 'Network Name', value: 'Etherlink Testnet' },
    { label: 'Chain ID', value: '128123' },
    { label: 'Symbol', value: 'XTZ' },
    { label: 'RPC URL', value: 'https://node.ghostnet.etherlink.com' },
    { label: 'Block Explorer URL', value: '	https://testnet.explorer.etherlink.com' },
];
exports.TOAST_CONTAINER_ID = 'qbpoorwpbcmnyejvnqad';
exports.ADD_ETHERLINK_MAINNET_URL = 'https://add-etherlink-mainnet.tconnect.io';
exports.ADD_ETHERLINK_GHOSTNET_URL = 'https://add-etherlink-testnet.tconnect.io';
//# sourceMappingURL=constants.js.map