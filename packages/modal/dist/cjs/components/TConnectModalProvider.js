"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTConnectModal = exports.TConnectModalProvider = exports.TConnectModalContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const core_1 = require("@tconnect.io/core");
const etherlink_provider_1 = require("@tconnect.io/etherlink-provider");
const tezos_beacon_provider_1 = require("@tconnect.io/tezos-beacon-provider");
const tezos_wc_provider_1 = require("@tconnect.io/tezos-wc-provider");
const react_1 = require("react");
const constants_1 = require("../constants");
const TConnectModal_1 = require("../modals/TConnectModal");
const utils_1 = require("../utils");
exports.TConnectModalContext = (0, react_1.createContext)({
    openModal: () => undefined,
    closeModal: () => undefined,
    etherlinkProvider: undefined,
    tezosBeaconProvider: undefined,
    tezosWcProvider: undefined,
    connected: false,
});
exports.TConnectModalProvider = (0, react_1.memo)(({ appName, appUrl, appIcon, bridgeUrl, apiKey, networkFilter, etherlinkNetwork, tezosBeaconNetwork, tezosWcNetwork, children, ...props }) => {
    const [showModal, setShowModal] = (0, react_1.useState)(false);
    const [step, setStep] = (0, react_1.useState)('connect');
    const [currentNetwork, setCurrentNetwork] = (0, react_1.useState)(undefined);
    const [currentWallet, setCurrentWallet] = (0, react_1.useState)(undefined);
    const [etherlinkProvider, setEtherlinkProvider] = (0, utils_1.useVersionedState)(undefined);
    const [tezosBeaconProvider, setTezosBeaconProvider] = (0, utils_1.useVersionedState)(undefined);
    const [tezosWcProvider, setTezosWcProvider] = (0, utils_1.useVersionedState)(undefined);
    const [connected, setConnected] = (0, utils_1.useVersionedState)(false);
    (0, react_1.useEffect)(() => {
        (async () => {
            try {
                const item = sessionStorage.getItem(constants_1.ETHERLINK_PROVIDER_STORAGE_KEY);
                if (item) {
                    const version = (0, utils_1.nextVersion)();
                    const provider = await etherlink_provider_1.TConnectEtherlinkProvider.deserialize(item);
                    setEtherlinkProvider(version, provider);
                }
            }
            catch (error) {
                (0, utils_1.handleError)(error);
            }
        })();
    }, [setEtherlinkProvider]);
    (0, react_1.useEffect)(() => {
        try {
            if (etherlinkProvider) {
                sessionStorage.setItem(constants_1.ETHERLINK_PROVIDER_STORAGE_KEY, etherlinkProvider.serialize());
            }
            else {
                sessionStorage.removeItem(constants_1.ETHERLINK_PROVIDER_STORAGE_KEY);
            }
        }
        catch (error) {
            (0, utils_1.handleError)(error);
        }
    }, [etherlinkProvider]);
    (0, react_1.useEffect)(() => {
        (async () => {
            try {
                const item = sessionStorage.getItem(constants_1.TEZOS_BEACON_PROVIDER_STORAGE_KEY);
                if (item) {
                    const version = (0, utils_1.nextVersion)();
                    const provider = await tezos_beacon_provider_1.TConnectTezosBeaconProvider.deserialize(item);
                    setTezosBeaconProvider(version, provider);
                }
            }
            catch (error) {
                (0, utils_1.handleError)(error);
            }
        })();
    }, [setTezosBeaconProvider]);
    (0, react_1.useEffect)(() => {
        try {
            if (tezosBeaconProvider) {
                sessionStorage.setItem(constants_1.TEZOS_BEACON_PROVIDER_STORAGE_KEY, tezosBeaconProvider.serialize());
            }
            else {
                sessionStorage.removeItem(constants_1.TEZOS_BEACON_PROVIDER_STORAGE_KEY);
            }
        }
        catch (error) {
            (0, utils_1.handleError)(error);
        }
    }, [tezosBeaconProvider]);
    (0, react_1.useEffect)(() => {
        (async () => {
            try {
                const item = sessionStorage.getItem(constants_1.TEZOS_WC_PROVIDER_STORAGE_KEY);
                if (item) {
                    const version = (0, utils_1.nextVersion)();
                    const provider = await tezos_wc_provider_1.TConnectTezosWcProvider.deserialize(item);
                    setTezosWcProvider(version, provider);
                }
            }
            catch (error) {
                (0, utils_1.handleError)(error);
            }
        })();
    }, [setTezosWcProvider]);
    (0, react_1.useEffect)(() => {
        try {
            if (tezosWcProvider) {
                sessionStorage.setItem(constants_1.TEZOS_WC_PROVIDER_STORAGE_KEY, tezosWcProvider.serialize());
            }
            else {
                sessionStorage.removeItem(constants_1.TEZOS_WC_PROVIDER_STORAGE_KEY);
            }
        }
        catch (error) {
            (0, utils_1.handleError)(error);
        }
    }, [tezosWcProvider]);
    const openModal = (0, react_1.useCallback)(() => {
        try {
            if (etherlinkProvider) {
                const network = constants_1.NETWORKS.find((network) => network.type === 'etherlink');
                if (network) {
                    const wallet = network.wallets.find((wallet) => wallet.walletApp === etherlinkProvider.walletApp);
                    if (wallet) {
                        setStep('connected');
                        setCurrentNetwork(network);
                        setCurrentWallet(wallet);
                    }
                }
            }
            else if (tezosBeaconProvider) {
                const network = constants_1.NETWORKS.find((network) => network.type === 'tezos');
                if (network) {
                    const wallet = network.wallets.find((wallet) => wallet.bridge === 'beacon' && wallet.walletApp === tezosBeaconProvider.walletApp);
                    if (wallet) {
                        setStep('connected');
                        setCurrentNetwork(network);
                        setCurrentWallet(wallet);
                    }
                }
            }
            else if (tezosWcProvider) {
                const network = constants_1.NETWORKS.find((network) => network.type === 'tezos');
                if (network) {
                    const wallet = network.wallets.find((wallet) => wallet.bridge === 'wc' && wallet.walletApp === tezosWcProvider.walletApp);
                    if (wallet) {
                        setStep('connected');
                        setCurrentNetwork(network);
                        setCurrentWallet(wallet);
                    }
                }
            }
            else {
                setStep('connect');
                setCurrentNetwork(undefined);
                setCurrentWallet(undefined);
            }
            setShowModal(true);
        }
        catch (error) {
            (0, utils_1.handleError)(error);
        }
    }, [etherlinkProvider, tezosBeaconProvider, tezosWcProvider]);
    const closeModal = (0, react_1.useCallback)(async () => {
        try {
            setShowModal(false);
        }
        catch (error) {
            (0, utils_1.handleError)(error);
        }
    }, []);
    const handleChangeEtherlinkProvider = (0, react_1.useCallback)(async (provider, chainId) => {
        try {
            if (etherlinkProvider) {
                await etherlinkProvider.disconnect();
            }
            provider.on('disconnect', () => {
                setEtherlinkProvider((0, utils_1.nextVersion)(), (prevProvider) => prevProvider === provider ? undefined : prevProvider);
            });
            setEtherlinkProvider((0, utils_1.nextVersion)(), provider);
            if (chainId === core_1.ETHERLINK_MAINNET_CHAIN_ID || chainId === core_1.ETHERLINK_GHOSTNET_CHAIN_ID) {
                closeModal();
            }
        }
        catch (error) {
            (0, utils_1.handleError)(error);
        }
    }, [etherlinkProvider, setEtherlinkProvider, closeModal]);
    const handleChangeTezosBeaconProvider = (0, react_1.useCallback)(async (provider) => {
        try {
            if (tezosBeaconProvider) {
                await tezosBeaconProvider.disconnect();
            }
            provider.on('disconnect', () => {
                setTezosBeaconProvider((0, utils_1.nextVersion)(), (prevProvider) => prevProvider === provider ? undefined : prevProvider);
            });
            setTezosBeaconProvider((0, utils_1.nextVersion)(), provider);
            closeModal();
        }
        catch (error) {
            (0, utils_1.handleError)(error);
        }
    }, [tezosBeaconProvider, setTezosBeaconProvider, closeModal]);
    const handleChangeTezosWcProvider = (0, react_1.useCallback)(async (provider) => {
        try {
            if (tezosWcProvider) {
                await tezosWcProvider.disconnect();
            }
            provider.on('disconnect', () => {
                setTezosWcProvider((0, utils_1.nextVersion)(), (prevProvider) => (prevProvider === provider ? undefined : prevProvider));
            });
            setTezosWcProvider((0, utils_1.nextVersion)(), provider);
            closeModal();
        }
        catch (error) {
            (0, utils_1.handleError)(error);
        }
    }, [tezosWcProvider, setTezosWcProvider, closeModal]);
    (0, react_1.useEffect)(() => {
        (async () => {
            try {
                const version = (0, utils_1.nextVersion)();
                const tmpConnected = ((await etherlinkProvider?.connected()) || tezosBeaconProvider?.connected()) ?? false;
                setConnected(version, tmpConnected);
            }
            catch (error) {
                (0, utils_1.handleError)(error);
            }
        })();
    }, [step, etherlinkProvider, tezosBeaconProvider, setConnected]);
    const handleDisconnect = (0, react_1.useCallback)(async () => {
        try {
            await Promise.all([
                etherlinkProvider?.disconnect(),
                tezosBeaconProvider?.disconnect(),
                tezosWcProvider?.disconnect(),
            ]);
            setEtherlinkProvider((0, utils_1.nextVersion)(), undefined);
            setTezosBeaconProvider((0, utils_1.nextVersion)(), undefined);
            setTezosWcProvider((0, utils_1.nextVersion)(), undefined);
            closeModal();
        }
        catch (error) {
            (0, utils_1.handleError)(error);
        }
    }, [
        etherlinkProvider,
        tezosBeaconProvider,
        tezosWcProvider,
        setEtherlinkProvider,
        setTezosBeaconProvider,
        setTezosWcProvider,
        closeModal,
    ]);
    const value = (0, react_1.useMemo)(() => ({
        openModal,
        closeModal,
        etherlinkProvider,
        tezosBeaconProvider,
        tezosWcProvider,
        connected,
    }), [openModal, closeModal, etherlinkProvider, tezosBeaconProvider, tezosWcProvider, connected]);
    return ((0, jsx_runtime_1.jsxs)(exports.TConnectModalContext.Provider, { value: value, ...props, children: [children, showModal && ((0, jsx_runtime_1.jsx)(TConnectModal_1.TConnectModal, { appName: appName, appUrl: appUrl, appIcon: appIcon, bridgeUrl: bridgeUrl, apiKey: apiKey, networkFilter: networkFilter, etherlinkNetwork: etherlinkNetwork, tezosBeaconNetwork: tezosBeaconNetwork, tezosWcNetwork: tezosWcNetwork, step: step, onChangeStep: setStep, currentNetwork: currentNetwork, onChangeCurrentNetwork: setCurrentNetwork, currentWallet: currentWallet, onChangeCurrentWallet: setCurrentWallet, etherlinkProvider: etherlinkProvider, onChangeEtherlinkProvider: handleChangeEtherlinkProvider, tezosBeaconProvider: tezosBeaconProvider, onChangeTezosBeaconProvider: handleChangeTezosBeaconProvider, tezosWcProvider: tezosWcProvider, onChangeTezosWcProvider: handleChangeTezosWcProvider, onDisconnect: handleDisconnect, onClose: closeModal }))] }));
});
exports.TConnectModalProvider.displayName = 'TConnectModalProvider';
const useTConnectModal = () => (0, react_1.useContext)(exports.TConnectModalContext);
exports.useTConnectModal = useTConnectModal;
//# sourceMappingURL=TConnectModalProvider.js.map