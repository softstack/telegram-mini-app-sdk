import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ETHERLINK_CHAIN_ID } from '@tconnect.io/core';
import { getOperatingSystem } from '@tconnect.io/dapp-utils';
import { TConnectEvmProvider } from '@tconnect.io/evm-provider';
import { TConnectTezosBeaconProvider } from '@tconnect.io/tezos-beacon-provider';
import { TConnectTezosWcProvider } from '@tconnect.io/tezos-wc-provider';
import WebApp from '@twa-dev/sdk';
import { clsx } from 'clsx';
import { Fragment, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { BeatLoader } from 'react-spinners';
import { Accordion } from '../components/Accordion';
import { BaseButton } from '../components/buttons/BaseButton';
import { GridButton } from '../components/buttons/GridButton';
import { HorizontalIconTextButton } from '../components/buttons/HorizontalIconTextButton';
import { TextButton } from '../components/buttons/TextButton';
import { Col } from '../components/flex/Col';
import { Row } from '../components/flex/Row';
import { Header } from '../components/Header';
import { NETWORKS } from '../constants';
import { nextVersion, useDarkMode, useVersionedState } from '../utils';
export const TConnectModal = memo(({ appName, appUrl, appIcon, bridgeUrl, apiKey, networkFilter, tezosBeaconNetwork, tezosWcNetwork, step, onChangeStep, currentNetwork, onChangeCurrentNetwork, currentWallet, onChangeCurrentWallet, evmProvider, onChangeEvmProvider, tezosBeaconProvider, onChangeTezosBeaconProvider, tezosWcProvider, onChangeTezosWcProvider, onDisconnect, onClose, onError, }) => {
    const darkMode = useDarkMode();
    const backgroundElement = useRef(null);
    const [showNetworks, setShowNetworks] = useState(true);
    const [showWallets, setShowWallets] = useState(false);
    const [address, setAddress] = useVersionedState(undefined);
    const [shortAddress, setShortAddress] = useVersionedState(undefined);
    const [showShortAddress, setShowShortAddress] = useState(true);
    const [copied, setCopied] = useState(false);
    useEffect(() => {
        (async () => {
            try {
                if (evmProvider) {
                    const version = nextVersion();
                    const response = (await evmProvider.request({ method: 'eth_accounts' }));
                    if (response.length > 0) {
                        setAddress(version, response[0]);
                        setShortAddress(version, `${response[0].slice(0, 12)}...${response[0].slice(-10)}`);
                    }
                }
                else if (tezosBeaconProvider) {
                    const version = nextVersion();
                    const address = await tezosBeaconProvider.getPKH();
                    setAddress(version, address);
                    setShortAddress(version, `${address.slice(0, 10)}...${address.slice(-10)}`);
                }
                else if (tezosWcProvider) {
                    const version = nextVersion();
                    const address = await tezosWcProvider.getPKH();
                    setAddress(version, address);
                    setShortAddress(version, `${address.slice(0, 10)}...${address.slice(-10)}`);
                }
            }
            catch (error) {
                onError(error);
            }
        })();
    }, [evmProvider, tezosBeaconProvider, tezosWcProvider, setAddress, setShortAddress, onError]);
    const handleBackground = useCallback((event) => {
        try {
            if (event.target === backgroundElement.current) {
                onClose();
            }
        }
        catch (error) {
            onError(error);
        }
    }, [onClose, onError]);
    const handleChangeNetwork = useCallback((network) => {
        try {
            onChangeCurrentNetwork(network);
            setShowWallets(true);
        }
        catch (error) {
            onError(error);
        }
    }, [onChangeCurrentNetwork, onError]);
    const filteredNetworks = useMemo(() => {
        try {
            return NETWORKS.filter((network) => !networkFilter || networkFilter.includes(network.type === 'evm' ? 'etherlink' : 'tezos'));
        }
        catch (error) {
            onError(error);
        }
        return [];
    }, [networkFilter, onError]);
    useEffect(() => {
        if (filteredNetworks.length === 1) {
            handleChangeNetwork(filteredNetworks[0]);
        }
    }, [filteredNetworks, handleChangeNetwork]);
    const wallets = useMemo(() => {
        try {
            const operatingSystem = getOperatingSystem();
            switch (currentNetwork?.type) {
                case 'evm': {
                    return currentNetwork.wallets.filter((wallet) => !operatingSystem || wallet.supportedOperatingSystems.includes(operatingSystem));
                }
                case 'tezos': {
                    return currentNetwork.wallets.filter((wallet) => !operatingSystem || wallet.supportedOperatingSystems.includes(operatingSystem));
                }
            }
        }
        catch (error) {
            onError(error);
        }
        return [];
    }, [currentNetwork, onError]);
    const handleChangeWallet = useCallback(async (wallet) => {
        try {
            onChangeStep('connecting');
            onChangeCurrentWallet(wallet);
            switch (wallet.network) {
                case 'evm': {
                    const provider = new TConnectEvmProvider({
                        appName,
                        appUrl,
                        appIcon,
                        bridgeUrl,
                        walletApp: wallet.walletApp,
                        apiKey,
                    });
                    provider.once('connect', (info) => {
                        if (BigInt(info.chainId) === ETHERLINK_CHAIN_ID) {
                            onChangeStep('connected');
                        }
                        else {
                            onChangeStep('invalidChainId');
                        }
                        onChangeEvmProvider(provider, BigInt(info.chainId));
                    });
                    await provider.connect();
                    break;
                }
                case 'tezos': {
                    switch (wallet.bridge) {
                        case 'beacon': {
                            const provider = new TConnectTezosBeaconProvider({
                                appName,
                                appUrl,
                                appIcon,
                                bridgeUrl,
                                walletApp: wallet.walletApp,
                                secretSeed: crypto.randomUUID(),
                                apiKey,
                                network: tezosBeaconNetwork ?? { type: 'mainnet' },
                            });
                            await provider.permissionRequest();
                            onChangeTezosBeaconProvider(provider);
                            break;
                        }
                        case 'wc': {
                            const provider = new TConnectTezosWcProvider({
                                appName,
                                appUrl,
                                appIcon,
                                bridgeUrl,
                                walletApp: wallet.walletApp,
                                apiKey,
                                network: tezosWcNetwork ?? 'mainnet',
                            });
                            await provider.permissionRequest();
                            onChangeTezosWcProvider(provider);
                            break;
                        }
                    }
                    break;
                }
            }
        }
        catch (error) {
            onError(error);
        }
    }, [
        onChangeStep,
        onChangeCurrentWallet,
        appName,
        appUrl,
        appIcon,
        bridgeUrl,
        apiKey,
        tezosBeaconNetwork,
        tezosWcNetwork,
        onChangeEvmProvider,
        onChangeTezosBeaconProvider,
        onChangeTezosWcProvider,
        onError,
    ]);
    const toggleShowShortAddress = useCallback(() => {
        try {
            setShowShortAddress((prevShowShortAddress) => !prevShowShortAddress);
        }
        catch (error) {
            onError(error);
        }
    }, [onError]);
    const handleCopyAddress = useCallback(() => {
        try {
            if (address) {
                navigator.clipboard.writeText(address);
                setCopied(true);
                setTimeout(() => {
                    setCopied(false);
                }, 1500);
            }
        }
        catch (error) {
            onError(error);
        }
    }, [address, onError]);
    const handleShowExplorer = useCallback(() => {
        try {
            if (currentWallet) {
                switch (currentWallet.network) {
                    case 'evm': {
                        WebApp.openLink(`https://explorer.etherlink.com/address/${address}`);
                        break;
                    }
                    case 'tezos': {
                        WebApp.openLink(`https://tzkt.io/${address}`);
                        break;
                    }
                }
            }
        }
        catch (error) {
            onError(error);
        }
    }, [currentWallet, address, onError]);
    return createPortal(_jsx(Col, { ref: backgroundElement, className: "fixed inset-0 z-[999999] justify-end bg-[#00000030] backdrop-blur", onClick: handleBackground, children: _jsx(Col, { className: clsx(step === 'connected' ? 'max-h-3/4' : 'h-3/4', 'rounded-t-3xl bg-white font-sans text-primaryText dark:bg-dark dark:text-primaryTextDark'), children: step === 'connect' ? (_jsxs(Fragment, { children: [_jsx(Header, { title: "Connect Account", onClose: onClose }), _jsx(Col, { className: "gap-y-6 overflow-y-scroll p-pageFrame", children: filteredNetworks.length > 0 && (_jsxs(Fragment, { children: [filteredNetworks.length > 1 && (_jsx(Accordion, { title: "Choose Network", open: showNetworks, onChangeOpen: setShowNetworks, children: filteredNetworks.map((network) => {
                                        const { name, icon } = network;
                                        return (_jsx(GridButton, { icon: icon, text: name, selected: network === currentNetwork, onClick: () => handleChangeNetwork(network) }, name));
                                    }) })), _jsx(Accordion, { title: "Select Wallet", open: showWallets, onChangeOpen: setShowWallets, children: wallets.map((wallet) => {
                                        const { name, icon } = wallet;
                                        return (_jsx(GridButton, { icon: icon, text: name, selected: false, onClick: () => handleChangeWallet(wallet) }, name));
                                    }) })] })) })] })) : step === 'connecting' ? (_jsxs(Fragment, { children: [_jsx(Header, { title: "Connecting", onClose: onClose }), _jsxs(Col, { className: "items-center gap-y-pageFrame overflow-y-scroll p-pageFrame", children: [_jsx(BeatLoader, { size: 8, color: darkMode ? '#fff' : '#000' }), _jsxs(Col, { className: "items-center gap-y-2", children: [_jsx(Row, { children: "Connecting Wallet" }), currentWallet && _jsxs(Row, { className: "text-sm", children: ["Please confirm in ", currentWallet.name, " app"] })] })] })] })) : step === 'invalidChainId' ? (_jsxs(Fragment, { children: [_jsx(Header, { title: "Unsupported Network", onClose: onClose }), _jsxs(Col, { className: "gap-y-pageFrame overflow-y-scroll p-pageFrame", children: [_jsxs(Row, { children: ["Please select Etherlink in ", currentWallet?.name] }), _jsxs(Row, { children: ["If Etherlink has not been added to ", currentWallet?.name, " yet, you can find a how-to here"] }), _jsx(TextButton, { text: "I have selected Etherlink", onClick: onClose })] })] })) : step === 'connected' ? (_jsxs(Fragment, { children: [_jsx(Header, { title: "Account Details", onClose: onClose }), _jsxs(Col, { className: "gap-y-pageFrame overflow-y-scroll p-pageFrame", children: [_jsxs(Col, { className: "gap-y-pageFrame rounded-lg border border-solid border-lineGrey p-3", children: [_jsxs(BaseButton, { className: "min-h-6 flex-row items-center gap-x-1.5", onClick: toggleShowShortAddress, children: [_jsx(Row, { className: "min-w[24px]", children: address && _jsx(Jazzicon, { diameter: 24, seed: jsNumberForAddress(address) }) }), _jsx(Row, { className: "break-all", children: showShortAddress ? shortAddress : address })] }), _jsxs(Row, { className: "justify-between", children: [_jsx(HorizontalIconTextButton, { icon: copied ? 'checkSolid' : 'copyRegular', iconColorSuccess: copied, text: "Copy address", onClick: handleCopyAddress }), _jsx(HorizontalIconTextButton, { icon: "fileLinesRegular", text: "View on explorer", onClick: handleShowExplorer })] })] }), _jsxs(Row, { className: "items-center justify-between", children: [_jsxs(Row, { className: "text-xs font-medium", children: ["Connected with ", currentWallet?.name] }), _jsx(BaseButton, { className: "items-center justify-center rounded-lg border border-solid border-[#ff8989] bg-[#ffe1e1] p-4 text-primaryText", onClick: onDisconnect, children: "Disconnect" })] })] })] })) : undefined }) }), document.body);
});
TConnectModal.displayName = 'TConnectModal';
//# sourceMappingURL=TConnectModal.js.map