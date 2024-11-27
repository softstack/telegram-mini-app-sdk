import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ETHERLINK_CHAIN_ID } from '@tconnect.io/core';
import { TConnectEvmProvider } from '@tconnect.io/evm-provider';
import { TConnectTezosBeaconProvider } from '@tconnect.io/tezos-beacon-provider';
import { TConnectTezosWcProvider } from '@tconnect.io/tezos-wc-provider';
import { createContext, memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { EVM_PROVIDER_STORAGE_KEY, EXPERIMENTAL_WALLET, NETWORKS, TEZOS_BEACON_PROVIDER_STORAGE_KEY, TEZOS_WC_PROVIDER_STORAGE_KEY, } from '../constants';
import { TConnectModal } from '../modals/TConnectModal';
import { nextVersion, useVersionedState } from '../utils';
export const TConnectModalContext = createContext({
    openModal: () => undefined,
    closeModal: () => undefined,
    evmProvider: undefined,
    tezosBeaconProvider: undefined,
    tezosWcProvider: undefined,
    connected: false,
});
export const TConnectModalProvider = memo(({ appName, appUrl, appIcon, bridgeUrl, apiKey, networkFilter, tezosBeaconNetwork, tezosWcNetwork, children, onError, closeModalOnError, ...props }) => {
    const [showModal, setShowModal] = useState(false);
    const [step, setStep] = useState('connect');
    const [currentNetwork, setCurrentNetwork] = useState(undefined);
    const [currentWallet, setCurrentWallet] = useState(undefined);
    const [evmProvider, setEvmProvider] = useVersionedState(undefined);
    const [tezosBeaconProvider, setTezosBeaconProvider] = useVersionedState(undefined);
    const [tezosWcProvider, setTezosWcProvider] = useVersionedState(undefined);
    const [connected, setConnected] = useVersionedState(false);
    const handleError = useCallback((error) => {
        if (closeModalOnError) {
            setShowModal(false);
        }
        if (onError) {
            setShowModal(false);
            onError(error);
        }
        else {
            console.error(error);
        }
    }, [onError, closeModalOnError]);
    useEffect(() => {
        (async () => {
            try {
                const item = sessionStorage.getItem(EVM_PROVIDER_STORAGE_KEY);
                if (item) {
                    const version = nextVersion();
                    const provider = await TConnectEvmProvider.deserialize(item);
                    setEvmProvider(version, provider);
                }
            }
            catch (error) {
                console.error(error);
            }
        })();
    }, [setEvmProvider]);
    useEffect(() => {
        try {
            if (evmProvider) {
                sessionStorage.setItem(EVM_PROVIDER_STORAGE_KEY, evmProvider.serialize());
            }
            else {
                sessionStorage.removeItem(EVM_PROVIDER_STORAGE_KEY);
            }
        }
        catch (error) {
            handleError(error);
        }
    }, [evmProvider, handleError]);
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
                console.error(error);
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
    }, [tezosBeaconProvider, handleError]);
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
                console.error(error);
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
    }, [tezosWcProvider, handleError]);
    const openModal = useCallback(() => {
        try {
            if (evmProvider) {
                const network = NETWORKS.find((network) => network.type === 'evm');
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
                const network = NETWORKS.find((network) => network.type === 'tezos');
                if (network) {
                    const wallet = tezosBeaconProvider.walletApp === '_generic_'
                        ? EXPERIMENTAL_WALLET
                        : network.wallets.find((wallet) => wallet.bridge === 'beacon' && wallet.walletApp === tezosBeaconProvider.walletApp);
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
    }, [evmProvider, tezosBeaconProvider, tezosWcProvider, handleError]);
    const closeModal = useCallback(async () => {
        try {
            setStep((prevStep) => (prevStep === 'invalidChainId' ? 'connected' : prevStep));
            setShowModal(false);
        }
        catch (error) {
            handleError(error);
        }
    }, [handleError]);
    const handleEvmProvider = useCallback(async (provider, chainId) => {
        try {
            if (evmProvider) {
                await evmProvider.disconnect();
            }
            provider.on('disconnect', () => {
                setEvmProvider(nextVersion(), (prevProvider) => (prevProvider === provider ? undefined : prevProvider));
            });
            setEvmProvider(nextVersion(), provider);
            if (chainId === ETHERLINK_CHAIN_ID) {
                closeModal();
            }
        }
        catch (error) {
            handleError(error);
        }
    }, [evmProvider, setEvmProvider, closeModal, handleError]);
    const handleTezosBeaconProvider = useCallback(async (provider) => {
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
    }, [tezosBeaconProvider, setTezosBeaconProvider, closeModal, handleError]);
    const handleTezosWcProvider = useCallback(async (provider) => {
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
    }, [tezosWcProvider, setTezosWcProvider, closeModal, handleError]);
    useEffect(() => {
        (async () => {
            try {
                const version = nextVersion();
                const tmpConnected = ((step !== 'invalidChainId' && (await evmProvider?.connected())) || tezosBeaconProvider?.connected()) ??
                    false;
                setConnected(version, tmpConnected);
            }
            catch (error) {
                handleError(error);
            }
        })();
    }, [step, evmProvider, tezosBeaconProvider, setConnected, handleError]);
    const handleDisconnect = useCallback(async () => {
        try {
            await Promise.all([
                evmProvider?.disconnect(),
                tezosBeaconProvider?.disconnect(),
                tezosWcProvider?.disconnect(),
            ]);
            setEvmProvider(nextVersion(), undefined);
            setTezosBeaconProvider(nextVersion(), undefined);
            setTezosWcProvider(nextVersion(), undefined);
            closeModal();
        }
        catch (error) {
            handleError(error);
        }
    }, [
        evmProvider,
        tezosBeaconProvider,
        tezosWcProvider,
        setEvmProvider,
        setTezosBeaconProvider,
        setTezosWcProvider,
        closeModal,
        handleError,
    ]);
    const value = useMemo(() => ({
        openModal,
        closeModal,
        evmProvider: step === 'invalidChainId' ? undefined : evmProvider,
        tezosBeaconProvider,
        tezosWcProvider,
        connected,
    }), [openModal, closeModal, step, evmProvider, tezosBeaconProvider, tezosWcProvider, connected]);
    return (_jsxs(TConnectModalContext.Provider, { value: value, ...props, children: [children, showModal && (_jsx(TConnectModal, { appName: appName, appUrl: appUrl, appIcon: appIcon, bridgeUrl: bridgeUrl, apiKey: apiKey, networkFilter: networkFilter, tezosBeaconNetwork: tezosBeaconNetwork, tezosWcNetwork: tezosWcNetwork, step: step, onChangeStep: setStep, currentNetwork: currentNetwork, onChangeCurrentNetwork: setCurrentNetwork, currentWallet: currentWallet, onChangeCurrentWallet: setCurrentWallet, evmProvider: evmProvider, onChangeEvmProvider: handleEvmProvider, tezosBeaconProvider: tezosBeaconProvider, onChangeTezosBeaconProvider: handleTezosBeaconProvider, tezosWcProvider: tezosWcProvider, onChangeTezosWcProvider: handleTezosWcProvider, onDisconnect: handleDisconnect, onClose: closeModal, onError: handleError }))] }));
});
TConnectModalProvider.displayName = 'TConnectModalProvider';
export const useTConnectModal = () => useContext(TConnectModalContext);
//# sourceMappingURL=TConnectModalProvider.js.map