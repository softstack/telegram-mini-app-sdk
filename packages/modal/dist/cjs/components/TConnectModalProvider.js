"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTConnectModal = exports.TConnectModalProvider = exports.TConnectModalContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const core_1 = require("@tconnect.io/core");
const evm_provider_1 = require("@tconnect.io/evm-provider");
const tezos_beacon_provider_1 = require("@tconnect.io/tezos-beacon-provider");
const tezos_wc_provider_1 = require("@tconnect.io/tezos-wc-provider");
const react_1 = require("react");
const constants_1 = require("../constants");
const TConnectModal_1 = require("../modals/TConnectModal");
const utils_1 = require("../utils");
exports.TConnectModalContext = (0, react_1.createContext)({
    openModal: () => undefined,
    closeModal: () => undefined,
    evmProvider: undefined,
    tezosBeaconProvider: undefined,
    tezosWcProvider: undefined,
    connected: false,
});
exports.TConnectModalProvider = (0, react_1.memo)(({ appName, appUrl, appIcon, bridgeUrl, apiKey, networkFilter, evmNetwork, tezosBeaconNetwork, tezosWcNetwork, children, ...props }) => {
    const [showModal, setShowModal] = (0, react_1.useState)(false);
    const [step, setStep] = (0, react_1.useState)('connect');
    const [currentNetwork, setCurrentNetwork] = (0, react_1.useState)(undefined);
    const [currentWallet, setCurrentWallet] = (0, react_1.useState)(undefined);
    const [evmProvider, setEvmProvider] = (0, utils_1.useVersionedState)(undefined);
    const [tezosBeaconProvider, setTezosBeaconProvider] = (0, utils_1.useVersionedState)(undefined);
    const [tezosWcProvider, setTezosWcProvider] = (0, utils_1.useVersionedState)(undefined);
    const [connected, setConnected] = (0, utils_1.useVersionedState)(false);
    (0, react_1.useEffect)(() => {
        (async () => {
            try {
                const item = sessionStorage.getItem(constants_1.EVM_PROVIDER_STORAGE_KEY);
                if (item) {
                    const version = (0, utils_1.nextVersion)();
                    const provider = await evm_provider_1.TConnectEvmProvider.deserialize(item);
                    setEvmProvider(version, provider);
                }
            }
            catch (error) {
                (0, utils_1.handleError)(error);
            }
        })();
    }, [setEvmProvider]);
    (0, react_1.useEffect)(() => {
        try {
            if (evmProvider) {
                sessionStorage.setItem(constants_1.EVM_PROVIDER_STORAGE_KEY, evmProvider.serialize());
            }
            else {
                sessionStorage.removeItem(constants_1.EVM_PROVIDER_STORAGE_KEY);
            }
        }
        catch (error) {
            (0, utils_1.handleError)(error);
        }
    }, [evmProvider]);
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
            if (evmProvider) {
                const network = constants_1.NETWORKS.find((network) => network.type === 'evm');
                if (network) {
                    const wallet = network.wallets.find((wallet) => wallet.walletApp === evmProvider.walletApp);
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
    }, [evmProvider, tezosBeaconProvider, tezosWcProvider]);
    const closeModal = (0, react_1.useCallback)(async () => {
        try {
            setStep((prevStep) => (prevStep === 'invalidChainId' ? 'connected' : prevStep));
            setShowModal(false);
        }
        catch (error) {
            (0, utils_1.handleError)(error);
        }
    }, []);
    const handleEvmProvider = (0, react_1.useCallback)(async (provider, chainId) => {
        try {
            if (evmProvider) {
                await evmProvider.disconnect();
            }
            provider.on('disconnect', () => {
                setEvmProvider((0, utils_1.nextVersion)(), (prevProvider) => (prevProvider === provider ? undefined : prevProvider));
            });
            setEvmProvider((0, utils_1.nextVersion)(), provider);
            if (chainId === core_1.ETHERLINK_CHAIN_ID) {
                closeModal();
            }
        }
        catch (error) {
            (0, utils_1.handleError)(error);
        }
    }, [evmProvider, setEvmProvider, closeModal]);
    const handleTezosBeaconProvider = (0, react_1.useCallback)(async (provider) => {
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
    const handleTezosWcProvider = (0, react_1.useCallback)(async (provider) => {
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
                const tmpConnected = ((step !== 'invalidChainId' && (await evmProvider?.connected())) || tezosBeaconProvider?.connected()) ??
                    false;
                setConnected(version, tmpConnected);
            }
            catch (error) {
                (0, utils_1.handleError)(error);
            }
        })();
    }, [step, evmProvider, tezosBeaconProvider, setConnected]);
    const handleDisconnect = (0, react_1.useCallback)(async () => {
        try {
            await Promise.all([
                evmProvider?.disconnect(),
                tezosBeaconProvider?.disconnect(),
                tezosWcProvider?.disconnect(),
            ]);
            setEvmProvider((0, utils_1.nextVersion)(), undefined);
            setTezosBeaconProvider((0, utils_1.nextVersion)(), undefined);
            setTezosWcProvider((0, utils_1.nextVersion)(), undefined);
            closeModal();
        }
        catch (error) {
            (0, utils_1.handleError)(error);
        }
    }, [
        evmProvider,
        tezosBeaconProvider,
        tezosWcProvider,
        setEvmProvider,
        setTezosBeaconProvider,
        setTezosWcProvider,
        closeModal,
    ]);
    const value = (0, react_1.useMemo)(() => ({
        openModal,
        closeModal,
        evmProvider: step === 'invalidChainId' ? undefined : evmProvider,
        tezosBeaconProvider,
        tezosWcProvider,
        connected,
    }), [openModal, closeModal, step, evmProvider, tezosBeaconProvider, tezosWcProvider, connected]);
    return ((0, jsx_runtime_1.jsxs)(exports.TConnectModalContext.Provider, { value: value, ...props, children: [children, showModal && ((0, jsx_runtime_1.jsx)(TConnectModal_1.TConnectModal, { appName: appName, appUrl: appUrl, appIcon: appIcon, bridgeUrl: bridgeUrl, apiKey: apiKey, networkFilter: networkFilter, evmNetwork: evmNetwork, tezosBeaconNetwork: tezosBeaconNetwork, tezosWcNetwork: tezosWcNetwork, step: step, onChangeStep: setStep, currentNetwork: currentNetwork, onChangeCurrentNetwork: setCurrentNetwork, currentWallet: currentWallet, onChangeCurrentWallet: setCurrentWallet, evmProvider: evmProvider, onChangeEvmProvider: handleEvmProvider, tezosBeaconProvider: tezosBeaconProvider, onChangeTezosBeaconProvider: handleTezosBeaconProvider, tezosWcProvider: tezosWcProvider, onChangeTezosWcProvider: handleTezosWcProvider, onDisconnect: handleDisconnect, onClose: closeModal }))] }));
});
exports.TConnectModalProvider.displayName = 'TConnectModalProvider';
const useTConnectModal = () => (0, react_1.useContext)(exports.TConnectModalContext);
exports.useTConnectModal = useTConnectModal;
//# sourceMappingURL=TConnectModalProvider.js.map