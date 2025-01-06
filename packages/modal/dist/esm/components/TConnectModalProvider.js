import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ETHERLINK_GHOSTNET_CHAIN_ID, ETHERLINK_MAINNET_CHAIN_ID } from '@tconnect.io/core';
import { TConnectEtherlinkProvider } from '@tconnect.io/etherlink-provider';
import { TConnectTezosBeaconProvider } from '@tconnect.io/tezos-beacon-provider';
import { TConnectTezosWcProvider } from '@tconnect.io/tezos-wc-provider';
import { createContext, memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ETHERLINK_PROVIDER_STORAGE_KEY, NETWORKS, TEZOS_BEACON_PROVIDER_STORAGE_KEY, TEZOS_WC_PROVIDER_STORAGE_KEY, } from '../constants';
import { TConnectModal } from '../modals/TConnectModal';
import { handleError, nextVersion, useVersionedState } from '../utils';
export const TConnectModalContext = createContext({
    openModal: () => undefined,
    closeModal: () => undefined,
    etherlinkProvider: undefined,
    tezosBeaconProvider: undefined,
    tezosWcProvider: undefined,
    connected: false,
});
export const TConnectModalProvider = memo(({ appName, appUrl, appIcon, bridgeUrl, apiKey, networkFilter, etherlinkNetwork, tezosBeaconNetwork, tezosWcNetwork, children, ...props }) => {
    const [showModal, setShowModal] = useState(false);
    const [step, setStep] = useState('connect');
    const [currentNetwork, setCurrentNetwork] = useState(undefined);
    const [currentWallet, setCurrentWallet] = useState(undefined);
    const [etherlinkProvider, setEtherlinkProvider] = useVersionedState(undefined);
    const [tezosBeaconProvider, setTezosBeaconProvider] = useVersionedState(undefined);
    const [tezosWcProvider, setTezosWcProvider] = useVersionedState(undefined);
    const [connected, setConnected] = useVersionedState(false);
    useEffect(() => {
        (async () => {
            try {
                const item = sessionStorage.getItem(ETHERLINK_PROVIDER_STORAGE_KEY);
                if (item) {
                    const version = nextVersion();
                    const provider = await TConnectEtherlinkProvider.deserialize(item);
                    setEtherlinkProvider(version, provider);
                }
            }
            catch (error) {
                handleError(error);
            }
        })();
    }, [setEtherlinkProvider]);
    useEffect(() => {
        try {
            if (etherlinkProvider) {
                sessionStorage.setItem(ETHERLINK_PROVIDER_STORAGE_KEY, etherlinkProvider.serialize());
            }
            else {
                sessionStorage.removeItem(ETHERLINK_PROVIDER_STORAGE_KEY);
            }
        }
        catch (error) {
            handleError(error);
        }
    }, [etherlinkProvider]);
    useEffect(() => {
        (async () => {
            try {
                const item = sessionStorage.getItem(TEZOS_BEACON_PROVIDER_STORAGE_KEY);
                if (item) {
                    const version = nextVersion();
                    const provider = await TConnectTezosBeaconProvider.deserialize(item);
                    setTezosBeaconProvider(version, provider);
                }
            }
            catch (error) {
                handleError(error);
            }
        })();
    }, [setTezosBeaconProvider]);
    useEffect(() => {
        try {
            if (tezosBeaconProvider) {
                sessionStorage.setItem(TEZOS_BEACON_PROVIDER_STORAGE_KEY, tezosBeaconProvider.serialize());
            }
            else {
                sessionStorage.removeItem(TEZOS_BEACON_PROVIDER_STORAGE_KEY);
            }
        }
        catch (error) {
            handleError(error);
        }
    }, [tezosBeaconProvider]);
    useEffect(() => {
        (async () => {
            try {
                const item = sessionStorage.getItem(TEZOS_WC_PROVIDER_STORAGE_KEY);
                if (item) {
                    const version = nextVersion();
                    const provider = await TConnectTezosWcProvider.deserialize(item);
                    setTezosWcProvider(version, provider);
                }
            }
            catch (error) {
                handleError(error);
            }
        })();
    }, [setTezosWcProvider]);
    useEffect(() => {
        try {
            if (tezosWcProvider) {
                sessionStorage.setItem(TEZOS_WC_PROVIDER_STORAGE_KEY, tezosWcProvider.serialize());
            }
            else {
                sessionStorage.removeItem(TEZOS_WC_PROVIDER_STORAGE_KEY);
            }
        }
        catch (error) {
            handleError(error);
        }
    }, [tezosWcProvider]);
    const openModal = useCallback(() => {
        try {
            if (etherlinkProvider) {
                const network = NETWORKS.find((network) => network.type === 'etherlink');
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
                const network = NETWORKS.find((network) => network.type === 'tezos');
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
                const network = NETWORKS.find((network) => network.type === 'tezos');
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
            handleError(error);
        }
    }, [etherlinkProvider, tezosBeaconProvider, tezosWcProvider]);
    const closeModal = useCallback(async () => {
        try {
            setShowModal(false);
        }
        catch (error) {
            handleError(error);
        }
    }, []);
    const handleChangeEtherlinkProvider = useCallback(async (provider, chainId) => {
        try {
            if (etherlinkProvider) {
                await etherlinkProvider.disconnect();
            }
            provider.on('disconnect', () => {
                setEtherlinkProvider(nextVersion(), (prevProvider) => prevProvider === provider ? undefined : prevProvider);
            });
            setEtherlinkProvider(nextVersion(), provider);
            if (chainId === ETHERLINK_MAINNET_CHAIN_ID || chainId === ETHERLINK_GHOSTNET_CHAIN_ID) {
                closeModal();
            }
        }
        catch (error) {
            handleError(error);
        }
    }, [etherlinkProvider, setEtherlinkProvider, closeModal]);
    const handleChangeTezosBeaconProvider = useCallback(async (provider) => {
        try {
            if (tezosBeaconProvider) {
                await tezosBeaconProvider.disconnect();
            }
            provider.on('disconnect', () => {
                setTezosBeaconProvider(nextVersion(), (prevProvider) => prevProvider === provider ? undefined : prevProvider);
            });
            setTezosBeaconProvider(nextVersion(), provider);
            closeModal();
        }
        catch (error) {
            handleError(error);
        }
    }, [tezosBeaconProvider, setTezosBeaconProvider, closeModal]);
    const handleChangeTezosWcProvider = useCallback(async (provider) => {
        try {
            if (tezosWcProvider) {
                await tezosWcProvider.disconnect();
            }
            provider.on('disconnect', () => {
                setTezosWcProvider(nextVersion(), (prevProvider) => (prevProvider === provider ? undefined : prevProvider));
            });
            setTezosWcProvider(nextVersion(), provider);
            closeModal();
        }
        catch (error) {
            handleError(error);
        }
    }, [tezosWcProvider, setTezosWcProvider, closeModal]);
    useEffect(() => {
        (async () => {
            try {
                const version = nextVersion();
                const tmpConnected = ((await etherlinkProvider?.connected()) || tezosBeaconProvider?.connected()) ?? false;
                setConnected(version, tmpConnected);
            }
            catch (error) {
                handleError(error);
            }
        })();
    }, [step, etherlinkProvider, tezosBeaconProvider, setConnected]);
    const handleDisconnect = useCallback(async () => {
        try {
            await Promise.all([
                etherlinkProvider?.disconnect(),
                tezosBeaconProvider?.disconnect(),
                tezosWcProvider?.disconnect(),
            ]);
            setEtherlinkProvider(nextVersion(), undefined);
            setTezosBeaconProvider(nextVersion(), undefined);
            setTezosWcProvider(nextVersion(), undefined);
            closeModal();
        }
        catch (error) {
            handleError(error);
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
    const value = useMemo(() => ({
        openModal,
        closeModal,
        etherlinkProvider,
        tezosBeaconProvider,
        tezosWcProvider,
        connected,
    }), [openModal, closeModal, etherlinkProvider, tezosBeaconProvider, tezosWcProvider, connected]);
    return (_jsxs(TConnectModalContext.Provider, { value: value, ...props, children: [children, showModal && (_jsx(TConnectModal, { appName: appName, appUrl: appUrl, appIcon: appIcon, bridgeUrl: bridgeUrl, apiKey: apiKey, networkFilter: networkFilter, etherlinkNetwork: etherlinkNetwork, tezosBeaconNetwork: tezosBeaconNetwork, tezosWcNetwork: tezosWcNetwork, step: step, onChangeStep: setStep, currentNetwork: currentNetwork, onChangeCurrentNetwork: setCurrentNetwork, currentWallet: currentWallet, onChangeCurrentWallet: setCurrentWallet, etherlinkProvider: etherlinkProvider, onChangeEtherlinkProvider: handleChangeEtherlinkProvider, tezosBeaconProvider: tezosBeaconProvider, onChangeTezosBeaconProvider: handleChangeTezosBeaconProvider, tezosWcProvider: tezosWcProvider, onChangeTezosWcProvider: handleChangeTezosWcProvider, onDisconnect: handleDisconnect, onClose: closeModal }))] }));
});
TConnectModalProvider.displayName = 'TConnectModalProvider';
export const useTConnectModal = () => useContext(TConnectModalContext);
//# sourceMappingURL=TConnectModalProvider.js.map