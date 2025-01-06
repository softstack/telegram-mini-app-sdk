import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { joinUrl } from '@tconnect.io/core';
import { getOperatingSystem, openLink, randomUUID } from '@tconnect.io/dapp-utils';
import { TConnectEtherlinkProvider } from '@tconnect.io/etherlink-provider';
import { TConnectTezosBeaconProvider } from '@tconnect.io/tezos-beacon-provider';
import { TConnectTezosWcProvider } from '@tconnect.io/tezos-wc-provider';
import { clsx } from 'clsx';
import { Fragment, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { Bounce, ToastContainer } from 'react-toastify';
import { Accordion } from '../components/Accordion';
import { BaseButton } from '../components/buttons/BaseButton';
import { CopyButton } from '../components/buttons/CopyButton';
import { GridButton } from '../components/buttons/GridButton';
import { HorizontalIconTextButton } from '../components/buttons/HorizontalIconTextButton';
import { TextButton } from '../components/buttons/TextButton';
import { Col } from '../components/flex/Col';
import { Row } from '../components/flex/Row';
import { Header } from '../components/Header';
import { Icon } from '../components/icons/Icon';
import { Labelled } from '../components/Labelled';
import { ETHERLINK_GHOSTNET_DETAILS, ETHERLINK_GHOSTNET_EXPLORER_URL, ETHERLINK_MAINNET_DETAILS, ETHERLINK_MAINNET_EXPLORER_URL, NETWORKS, TEZOS_GHOSTNET_EXPLORER_URL, TEZOS_MAINNET_EXPLORER_URL, TOAST_CONTAINER_ID, } from '../constants';
import { handleError, nextVersion, tw, useVersionedState } from '../utils';
export const TConnectModal = memo(({ appName, appUrl, appIcon, bridgeUrl, apiKey, networkFilter, etherlinkNetwork = 'ghostnet', tezosBeaconNetwork = { type: 'ghostnet' }, tezosWcNetwork = 'ghostnet', step, onChangeStep, currentNetwork, onChangeCurrentNetwork, currentWallet, onChangeCurrentWallet, etherlinkProvider, onChangeEtherlinkProvider, tezosBeaconProvider, onChangeTezosBeaconProvider, tezosWcProvider, onChangeTezosWcProvider, onDisconnect, onClose, }) => {
    const backgroundElement = useRef(null);
    const [showNetworks, setShowNetworks] = useState(true);
    const [showWallets, setShowWallets] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [connectingTab, setConnectingTab] = useState('connect');
    const [address, setAddress] = useVersionedState(undefined);
    const [shortAddress, setShortAddress] = useVersionedState(undefined);
    const [showShortAddress, setShowShortAddress] = useState(true);
    useEffect(() => {
        (async () => {
            try {
                if (etherlinkProvider) {
                    const version = nextVersion();
                    const response = (await etherlinkProvider.request({ method: 'eth_accounts' }));
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
                handleError(error);
            }
        })();
    }, [etherlinkProvider, tezosBeaconProvider, tezosWcProvider, setAddress, setShortAddress]);
    const handleBackground = useCallback((event) => {
        try {
            if (event.target === backgroundElement.current) {
                onClose();
            }
        }
        catch (error) {
            handleError(error);
        }
    }, [onClose]);
    const handleChangeNetwork = useCallback((network) => {
        try {
            onChangeCurrentNetwork(network);
            setShowWallets(true);
        }
        catch (error) {
            handleError(error);
        }
    }, [onChangeCurrentNetwork]);
    const filteredNetworks = useMemo(() => {
        try {
            return NETWORKS.filter((network) => !networkFilter || networkFilter.includes(network.type === 'etherlink' ? 'etherlink' : 'tezos'));
        }
        catch (error) {
            handleError(error);
        }
        return [];
    }, [networkFilter]);
    useEffect(() => {
        if (filteredNetworks.length === 1) {
            handleChangeNetwork(filteredNetworks[0]);
        }
    }, [filteredNetworks, handleChangeNetwork]);
    const wallets = useMemo(() => {
        try {
            const operatingSystem = getOperatingSystem();
            switch (currentNetwork?.type) {
                case 'etherlink': {
                    return currentNetwork.wallets.filter((wallet) => !operatingSystem || wallet.supportedOperatingSystems.includes(operatingSystem));
                }
                case 'tezos': {
                    return currentNetwork.wallets.filter((wallet) => !operatingSystem || wallet.supportedOperatingSystems.includes(operatingSystem));
                }
            }
        }
        catch (error) {
            handleError(error);
        }
        return [];
    }, [currentNetwork]);
    const handleChangeWallet = useCallback(async (wallet) => {
        try {
            onChangeCurrentWallet(wallet);
            setConnecting(true);
            setConnectingTab('connect');
            onChangeStep('connecting');
            switch (wallet.network) {
                case 'etherlink': {
                    const provider = new TConnectEtherlinkProvider({
                        appName,
                        appUrl,
                        appIcon,
                        bridgeUrl,
                        walletApp: wallet.walletApp,
                        apiKey,
                        network: etherlinkNetwork,
                    });
                    provider.once('connect', (info) => {
                        onChangeEtherlinkProvider(provider, BigInt(info.chainId));
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
                                secretSeed: randomUUID(),
                                apiKey,
                                network: tezosBeaconNetwork,
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
                                network: tezosWcNetwork,
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
            handleError(error);
            setConnecting(false);
        }
    }, [
        onChangeStep,
        onChangeCurrentWallet,
        appName,
        appUrl,
        appIcon,
        bridgeUrl,
        apiKey,
        etherlinkNetwork,
        tezosBeaconNetwork,
        tezosWcNetwork,
        onChangeEtherlinkProvider,
        onChangeTezosBeaconProvider,
        onChangeTezosWcProvider,
    ]);
    const toggleShowShortAddress = useCallback(() => {
        try {
            setShowShortAddress((prevShowShortAddress) => !prevShowShortAddress);
        }
        catch (error) {
            handleError(error);
        }
    }, []);
    const handleShowExplorer = useCallback(() => {
        try {
            if (currentWallet?.bridge === 'etherlink' && etherlinkProvider) {
                const url = etherlinkProvider?.network === 'ghostnet'
                    ? ETHERLINK_GHOSTNET_EXPLORER_URL
                    : ETHERLINK_MAINNET_EXPLORER_URL;
                if (address) {
                    openLink(joinUrl(url, 'address', address));
                }
                else {
                    openLink(joinUrl(url));
                }
            }
            else if (tezosBeaconProvider || tezosWcProvider) {
                if (tezosBeaconProvider?.network.type === 'ghostnet' || tezosWcProvider?.network === 'ghostnet') {
                    openLink(joinUrl(TEZOS_GHOSTNET_EXPLORER_URL, address ?? ''));
                }
                else {
                    openLink(joinUrl(TEZOS_MAINNET_EXPLORER_URL, address ?? ''));
                }
            }
        }
        catch (error) {
            handleError(error);
        }
    }, [currentWallet, address, etherlinkProvider, tezosBeaconProvider, tezosWcProvider]);
    return createPortal(_jsxs(Col, { ref: backgroundElement, className: "fixed inset-0 z-[999999] justify-end bg-[#00000030] backdrop-blur", onClick: handleBackground, children: [_jsx(Col, { className: clsx(step === 'connected' ? 'max-h-3/4' : 'h-3/4', 'rounded-t-3xl bg-light font-sans text-primaryText dark:bg-dark dark:text-primaryTextDark'), children: step === 'connect' ? (_jsxs(Fragment, { children: [_jsx(Header, { title: "Connect Account", onClose: onClose }), _jsx(Col, { className: "gap-y-6 overflow-y-scroll p-pageFrame", children: filteredNetworks.length > 0 && (_jsxs(Fragment, { children: [filteredNetworks.length > 1 && (_jsx(Accordion, { title: "Choose Network", open: showNetworks, onChangeOpen: setShowNetworks, children: filteredNetworks.map((network) => {
                                            const { name, icon } = network;
                                            return (_jsx(GridButton, { icon: icon, text: name, selected: network === currentNetwork, onClick: () => handleChangeNetwork(network) }, name));
                                        }) })), _jsx(Accordion, { title: "Select Wallet", open: showWallets, onChangeOpen: setShowWallets, children: wallets.map((wallet) => {
                                            const { name, icon } = wallet;
                                            return (_jsx(GridButton, { icon: icon, text: name, selected: false, onClick: () => handleChangeWallet(wallet) }, name));
                                        }) })] })) })] })) : step === 'connecting' && currentWallet ? (_jsxs(Fragment, { children: [_jsx(Header, { onBack: () => onChangeStep('connect'), title: currentWallet.name, onClose: onClose }), _jsxs(Col, { className: "flex-1 items-stretch gap-y-pageFrame overflow-y-scroll p-pageFrame", children: [currentWallet.network === 'etherlink' && (_jsxs(Row, { className: "gap-x-10", children: [_jsx(Row, { className: "flex-1 justify-end", children: _jsx(HorizontalIconTextButton, { className: clsx(connectingTab !== 'connect' && 'text-inactive dark:text-inactiveDark'), icon: "linkSolid", text: "Connect", onClick: () => setConnectingTab('connect') }) }), _jsx(Row, { className: "flex-1", children: _jsx(HorizontalIconTextButton, { className: clsx(connectingTab !== 'addEtherlink' && 'text-inactive dark:text-inactiveDark'), icon: "plusSolid", text: "Add Etherlink", onClick: () => setConnectingTab('addEtherlink') }) })] })), connectingTab === 'connect' ? (_jsx(Fragment, { children: _jsxs(Col, { className: "flex-1 items-center gap-y-pageFrame", children: [_jsxs(Col, { className: "flex-1 items-center justify-center gap-y-pageFrame", children: [_jsx("div", { className: tw(connecting && 'spinner before:bg-tezos before:content-[""]'), children: _jsx("div", { className: tw(connecting
                                                                ? 'inner bg-light dark:bg-dark'
                                                                : 'flex h-[52px] w-[52px] items-center justify-center'), children: _jsx(Icon, { icon: currentWallet.icon, className: "rounded-[0.5rem] object-contain", height: 48, width: 48 }) }) }), _jsxs(Row, { className: "text-lg font-medium", children: ["Please confirm in ", currentWallet.name] }), currentWallet.network === 'etherlink' && (_jsxs(Row, { className: "text-center", children: ["If you have issues, please make sure Etherlink has been added to ", currentWallet.name] }))] }), _jsxs(Row, { className: "items-center justify-between self-stretch", children: [_jsx(Row, { children: "Connection didn\u2019t work?" }), _jsx(TextButton, { text: "Try again", onClick: () => handleChangeWallet(currentWallet) })] })] }) })) : (_jsx(Fragment, { children: currentWallet?.network === 'etherlink' && (_jsxs(Fragment, { children: [_jsx(Col, { className: "gap-y-3 self-start pt-2", children: (etherlinkNetwork === 'mainnet'
                                                    ? ETHERLINK_MAINNET_DETAILS
                                                    : ETHERLINK_GHOSTNET_DETAILS).map(({ label, value }, index) => (_jsx(Labelled, { label: label, children: _jsx(CopyButton, { text: value, value: value }) }, index))) }), _jsxs(Row, { className: "items-center justify-between", children: [_jsx(Row, { children: "Has Etherlink been added?" }), _jsx(TextButton, { text: "Try again", onClick: () => handleChangeWallet(currentWallet) })] })] })) }))] })] })) : step === 'connected' ? (_jsxs(Fragment, { children: [_jsx(Header, { title: "Account Details", onClose: onClose }), _jsxs(Col, { className: "gap-y-pageFrame overflow-y-scroll p-pageFrame", children: [_jsxs(Col, { className: "gap-y-pageFrame rounded-lg border border-solid border-line p-3", children: [_jsxs(BaseButton, { className: "min-h-6 flex-row items-center gap-x-1.5", onClick: toggleShowShortAddress, children: [_jsx(Row, { className: "min-w[24px]", children: address && _jsx(Jazzicon, { diameter: 24, seed: jsNumberForAddress(address) }) }), _jsx(Row, { className: "break-all", children: showShortAddress ? shortAddress : address })] }), _jsxs(Row, { className: "justify-between", children: [_jsx(CopyButton, { text: "Copy address", value: address }), _jsx(HorizontalIconTextButton, { icon: "fileLinesRegular", text: "View on explorer", onClick: handleShowExplorer })] })] }), _jsxs(Row, { className: "items-center justify-between", children: [_jsxs(Row, { className: "text-xs font-medium", children: ["Connected with ", currentWallet?.name] }), _jsx(BaseButton, { className: "items-center justify-center rounded-lg border border-solid border-[#ff8989] bg-[#ffe1e1] p-4 text-primaryText", onClick: onDisconnect, children: "Disconnect" })] })] })] })) : undefined }), _jsx(ToastContainer, { containerId: TOAST_CONTAINER_ID, position: "top-center", autoClose: 5000, hideProgressBar: false, newestOnTop: false, closeOnClick: true, rtl: false, pauseOnFocusLoss: true, draggable: true, pauseOnHover: true, theme: "colored", transition: Bounce })] }), document.body);
});
TConnectModal.displayName = 'TConnectModal';
//# sourceMappingURL=TConnectModal.js.map