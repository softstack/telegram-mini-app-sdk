export const TAILWIND_PREFIX = 'eotrzpirnbqlbfjhbqpo-';
export const ETHERLINK_PROVIDER_STORAGE_KEY = 'ksacuemelbykuqyutopv';
export const TEZOS_BEACON_PROVIDER_STORAGE_KEY = 'jkdkvddgajorkvmywwub';
export const TEZOS_WC_PROVIDER_STORAGE_KEY = 'nxmhhphkvgwzhmifdyus';
export const NETWORKS = [
    {
        type: 'etherlink',
        name: 'Etherlink',
        icon: 'etherlink',
        wallets: [
            {
                name: 'Bitget',
                icon: 'bitget',
                network: 'etherlink',
                bridge: 'etherlink',
                walletApp: 'bitget',
                supportedOperatingSystems: ['android', 'ios'],
            },
            {
                name: 'MetaMask',
                icon: 'metaMask',
                network: 'etherlink',
                bridge: 'etherlink',
                walletApp: 'metaMask',
                supportedOperatingSystems: ['android', 'ios'],
            },
            {
                name: 'SafePal',
                icon: 'safePal',
                network: 'etherlink',
                bridge: 'etherlink',
                walletApp: 'safePal',
                supportedOperatingSystems: ['android', 'ios'],
            },
            {
                name: 'Trust',
                icon: 'trust',
                network: 'etherlink',
                bridge: 'etherlink',
                walletApp: 'trust',
                supportedOperatingSystems: ['android'],
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
export const ETHERLINK_MAINNET_EXPLORER_URL = 'https://explorer.etherlink.com';
export const ETHERLINK_GHOSTNET_EXPLORER_URL = 'https://testnet.explorer.etherlink.com';
export const TEZOS_MAINNET_EXPLORER_URL = 'https://tzkt.io';
export const TEZOS_GHOSTNET_EXPLORER_URL = 'https://ghostnet.tzkt.io';
export const ETHERLINK_MAINNET_DETAILS = [
    { label: 'Network Name', value: 'Etherlink Mainnet' },
    { label: 'Chain ID', value: '42793' },
    { label: 'Symbol', value: 'XTZ' },
    { label: 'RPC URL', value: 'https://node.mainnet.etherlink.com' },
    { label: 'Block Explorer URL', value: ETHERLINK_MAINNET_EXPLORER_URL },
];
export const ETHERLINK_GHOSTNET_DETAILS = [
    { label: 'Network Name', value: 'Etherlink Testnet' },
    { label: 'Chain ID', value: '128123' },
    { label: 'Symbol', value: 'XTZ' },
    { label: 'RPC URL', value: 'https://node.ghostnet.etherlink.com' },
    { label: 'Block Explorer URL', value: ETHERLINK_GHOSTNET_EXPLORER_URL },
];
export const TOAST_CONTAINER_ID = 'qbpoorwpbcmnyejvnqad';
export const ADD_ETHERLINK_MAINNET_URL = 'https://add-etherlink-mainnet.tconnect.io';
export const ADD_ETHERLINK_GHOSTNET_URL = 'https://add-etherlink-testnet.tconnect.io';
//# sourceMappingURL=constants.js.map