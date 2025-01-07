"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TConnectModal = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const core_1 = require("@tconnect.io/core");
const dapp_utils_1 = require("@tconnect.io/dapp-utils");
const etherlink_provider_1 = require("@tconnect.io/etherlink-provider");
const tezos_beacon_provider_1 = require("@tconnect.io/tezos-beacon-provider");
const tezos_wc_provider_1 = require("@tconnect.io/tezos-wc-provider");
const clsx_1 = require("clsx");
const react_1 = require("react");
const react_dom_1 = require("react-dom");
const react_jazzicon_1 = __importStar(require("react-jazzicon"));
const react_toastify_1 = require("react-toastify");
const Accordion_1 = require("../components/Accordion");
const BaseButton_1 = require("../components/buttons/BaseButton");
const CopyButton_1 = require("../components/buttons/CopyButton");
const GridButton_1 = require("../components/buttons/GridButton");
const HorizontalIconTextButton_1 = require("../components/buttons/HorizontalIconTextButton");
const TextButton_1 = require("../components/buttons/TextButton");
const Col_1 = require("../components/flex/Col");
const Row_1 = require("../components/flex/Row");
const Header_1 = require("../components/Header");
const Icon_1 = require("../components/icons/Icon");
const Labelled_1 = require("../components/Labelled");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
exports.TConnectModal = (0, react_1.memo)(({ appName, appUrl, appIcon, bridgeUrl, apiKey, networkFilter, etherlinkNetwork = 'ghostnet', tezosBeaconNetwork = { type: 'ghostnet' }, tezosWcNetwork = 'ghostnet', step, onChangeStep, currentNetwork, onChangeCurrentNetwork, currentWallet, onChangeCurrentWallet, etherlinkProvider, onChangeEtherlinkProvider, tezosBeaconProvider, onChangeTezosBeaconProvider, tezosWcProvider, onChangeTezosWcProvider, onDisconnect, onClose, }) => {
    const backgroundElement = (0, react_1.useRef)(null);
    const [showNetworks, setShowNetworks] = (0, react_1.useState)(true);
    const [showWallets, setShowWallets] = (0, react_1.useState)(false);
    const [connecting, setConnecting] = (0, react_1.useState)(false);
    const [connectingTab, setConnectingTab] = (0, react_1.useState)('connect');
    const [address, setAddress] = (0, utils_1.useVersionedState)(undefined);
    const [shortAddress, setShortAddress] = (0, utils_1.useVersionedState)(undefined);
    const [showShortAddress, setShowShortAddress] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        (async () => {
            try {
                if (etherlinkProvider) {
                    const version = (0, utils_1.nextVersion)();
                    const response = (await etherlinkProvider.request({ method: 'eth_accounts' }));
                    if (response.length > 0) {
                        setAddress(version, response[0]);
                        setShortAddress(version, `${response[0].slice(0, 12)}...${response[0].slice(-10)}`);
                    }
                }
                else if (tezosBeaconProvider) {
                    const version = (0, utils_1.nextVersion)();
                    const address = await tezosBeaconProvider.getPKH();
                    setAddress(version, address);
                    setShortAddress(version, `${address.slice(0, 10)}...${address.slice(-10)}`);
                }
                else if (tezosWcProvider) {
                    const version = (0, utils_1.nextVersion)();
                    const address = await tezosWcProvider.getPKH();
                    setAddress(version, address);
                    setShortAddress(version, `${address.slice(0, 10)}...${address.slice(-10)}`);
                }
            }
            catch (error) {
                (0, utils_1.handleError)(error);
            }
        })();
    }, [etherlinkProvider, tezosBeaconProvider, tezosWcProvider, setAddress, setShortAddress]);
    const handleBackground = (0, react_1.useCallback)((event) => {
        try {
            if (event.target === backgroundElement.current) {
                onClose();
            }
        }
        catch (error) {
            (0, utils_1.handleError)(error);
        }
    }, [onClose]);
    const handleChangeNetwork = (0, react_1.useCallback)((network) => {
        try {
            onChangeCurrentNetwork(network);
            setShowWallets(true);
        }
        catch (error) {
            (0, utils_1.handleError)(error);
        }
    }, [onChangeCurrentNetwork]);
    const filteredNetworks = (0, react_1.useMemo)(() => {
        try {
            return constants_1.NETWORKS.filter((network) => !networkFilter || networkFilter.includes(network.type === 'etherlink' ? 'etherlink' : 'tezos'));
        }
        catch (error) {
            (0, utils_1.handleError)(error);
        }
        return [];
    }, [networkFilter]);
    (0, react_1.useEffect)(() => {
        if (filteredNetworks.length === 1) {
            handleChangeNetwork(filteredNetworks[0]);
        }
    }, [filteredNetworks, handleChangeNetwork]);
    const wallets = (0, react_1.useMemo)(() => {
        try {
            const operatingSystem = (0, dapp_utils_1.getOperatingSystem)();
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
            (0, utils_1.handleError)(error);
        }
        return [];
    }, [currentNetwork]);
    const handleChangeWallet = (0, react_1.useCallback)(async (wallet) => {
        try {
            onChangeCurrentWallet(wallet);
            setConnecting(true);
            setConnectingTab('connect');
            onChangeStep('connecting');
            switch (wallet.network) {
                case 'etherlink': {
                    const provider = new etherlink_provider_1.TConnectEtherlinkProvider({
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
                            const provider = new tezos_beacon_provider_1.TConnectTezosBeaconProvider({
                                appName,
                                appUrl,
                                appIcon,
                                bridgeUrl,
                                walletApp: wallet.walletApp,
                                secretSeed: (0, dapp_utils_1.randomUUID)(),
                                apiKey,
                                network: tezosBeaconNetwork,
                            });
                            await provider.permissionRequest();
                            onChangeTezosBeaconProvider(provider);
                            break;
                        }
                        case 'wc': {
                            const provider = new tezos_wc_provider_1.TConnectTezosWcProvider({
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
            (0, utils_1.handleError)(error);
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
    const toggleShowShortAddress = (0, react_1.useCallback)(() => {
        try {
            setShowShortAddress((prevShowShortAddress) => !prevShowShortAddress);
        }
        catch (error) {
            (0, utils_1.handleError)(error);
        }
    }, []);
    const handleShowExplorer = (0, react_1.useCallback)(() => {
        try {
            if (currentWallet?.bridge === 'etherlink' && etherlinkProvider) {
                const url = etherlinkProvider?.network === 'ghostnet'
                    ? constants_1.ETHERLINK_GHOSTNET_EXPLORER_URL
                    : constants_1.ETHERLINK_MAINNET_EXPLORER_URL;
                if (address) {
                    (0, dapp_utils_1.openLink)((0, core_1.joinUrl)(url, 'address', address));
                }
                else {
                    (0, dapp_utils_1.openLink)((0, core_1.joinUrl)(url));
                }
            }
            else if (tezosBeaconProvider || tezosWcProvider) {
                if (tezosBeaconProvider?.network.type === 'ghostnet' || tezosWcProvider?.network === 'ghostnet') {
                    (0, dapp_utils_1.openLink)((0, core_1.joinUrl)(constants_1.TEZOS_GHOSTNET_EXPLORER_URL, address ?? ''));
                }
                else {
                    (0, dapp_utils_1.openLink)((0, core_1.joinUrl)(constants_1.TEZOS_MAINNET_EXPLORER_URL, address ?? ''));
                }
            }
        }
        catch (error) {
            (0, utils_1.handleError)(error);
        }
    }, [currentWallet, address, etherlinkProvider, tezosBeaconProvider, tezosWcProvider]);
    return (0, react_dom_1.createPortal)((0, jsx_runtime_1.jsxs)(Col_1.Col, { ref: backgroundElement, className: "fixed inset-0 z-[999999] justify-end bg-[#00000030] backdrop-blur", onClick: handleBackground, children: [(0, jsx_runtime_1.jsx)(Col_1.Col, { className: (0, clsx_1.clsx)(step === 'connected' ? 'max-h-3/4' : 'h-3/4', 'rounded-t-3xl bg-light font-sans text-primaryText dark:bg-dark dark:text-primaryTextDark'), children: step === 'connect' ? ((0, jsx_runtime_1.jsxs)(react_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Header_1.Header, { title: "Connect Account", onClose: onClose }), (0, jsx_runtime_1.jsx)(Col_1.Col, { className: "gap-y-6 overflow-y-scroll p-pageFrame", children: filteredNetworks.length > 0 && ((0, jsx_runtime_1.jsxs)(react_1.Fragment, { children: [filteredNetworks.length > 1 && ((0, jsx_runtime_1.jsx)(Accordion_1.Accordion, { title: "Choose Network", open: showNetworks, onChangeOpen: setShowNetworks, children: filteredNetworks.map((network) => {
                                            const { name, icon } = network;
                                            return ((0, jsx_runtime_1.jsx)(GridButton_1.GridButton, { icon: icon, text: name, selected: network === currentNetwork, onClick: () => handleChangeNetwork(network) }, name));
                                        }) })), (0, jsx_runtime_1.jsx)(Accordion_1.Accordion, { title: "Select Wallet", open: showWallets, onChangeOpen: setShowWallets, children: wallets.map((wallet) => {
                                            const { name, icon } = wallet;
                                            return ((0, jsx_runtime_1.jsx)(GridButton_1.GridButton, { icon: icon, text: name, selected: false, onClick: () => handleChangeWallet(wallet) }, name));
                                        }) })] })) })] })) : step === 'connecting' && currentWallet ? ((0, jsx_runtime_1.jsxs)(react_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Header_1.Header, { onBack: () => onChangeStep('connect'), title: currentWallet.name, onClose: onClose }), (0, jsx_runtime_1.jsxs)(Col_1.Col, { className: "flex-1 items-stretch gap-y-pageFrame overflow-y-scroll p-pageFrame", children: [currentWallet.network === 'etherlink' && ((0, jsx_runtime_1.jsxs)(Row_1.Row, { className: "gap-x-10", children: [(0, jsx_runtime_1.jsx)(Row_1.Row, { className: "flex-1 justify-end", children: (0, jsx_runtime_1.jsx)(HorizontalIconTextButton_1.HorizontalIconTextButton, { className: (0, clsx_1.clsx)(connectingTab !== 'connect' && 'text-inactive dark:text-inactiveDark'), icon: "linkSolid", text: "Connect", onClick: () => setConnectingTab('connect') }) }), (0, jsx_runtime_1.jsx)(Row_1.Row, { className: "flex-1", children: (0, jsx_runtime_1.jsx)(HorizontalIconTextButton_1.HorizontalIconTextButton, { className: (0, clsx_1.clsx)(connectingTab !== 'addEtherlink' && 'text-inactive dark:text-inactiveDark'), icon: "plusSolid", text: "Add Etherlink", onClick: () => setConnectingTab('addEtherlink') }) })] })), connectingTab === 'connect' ? ((0, jsx_runtime_1.jsx)(react_1.Fragment, { children: (0, jsx_runtime_1.jsxs)(Col_1.Col, { className: "flex-1 items-center gap-y-pageFrame", children: [(0, jsx_runtime_1.jsxs)(Col_1.Col, { className: "flex-1 items-center justify-center gap-y-pageFrame", children: [(0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.tw)(connecting &&
                                                            `spinner before:content-[""] ${currentWallet.network === 'tezos' ? 'before:bg-tezos' : 'before:bg-etherlink'}`), children: (0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.tw)(connecting
                                                                ? 'inner bg-light dark:bg-dark'
                                                                : 'flex h-[52px] w-[52px] items-center justify-center'), children: (0, jsx_runtime_1.jsx)(Icon_1.Icon, { icon: currentWallet.icon, className: "rounded-[0.5rem] object-contain", height: 48, width: 48 }) }) }), (0, jsx_runtime_1.jsxs)(Row_1.Row, { className: "text-lg font-medium", children: ["Please confirm in ", currentWallet.name] }), currentWallet.network === 'etherlink' && ((0, jsx_runtime_1.jsxs)(Row_1.Row, { className: "text-center", children: ["If you have issues, please make sure Etherlink has been added to ", currentWallet.name] }))] }), (0, jsx_runtime_1.jsxs)(Row_1.Row, { className: "items-center justify-between self-stretch", children: [(0, jsx_runtime_1.jsx)(Row_1.Row, { children: "Connection didn\u2019t work?" }), (0, jsx_runtime_1.jsx)(TextButton_1.TextButton, { text: "Try again", onClick: () => handleChangeWallet(currentWallet) })] })] }) })) : ((0, jsx_runtime_1.jsx)(react_1.Fragment, { children: currentWallet?.network === 'etherlink' && ((0, jsx_runtime_1.jsxs)(react_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Col_1.Col, { className: "gap-y-3 self-start pt-2", children: (etherlinkNetwork === 'mainnet'
                                                    ? constants_1.ETHERLINK_MAINNET_DETAILS
                                                    : constants_1.ETHERLINK_GHOSTNET_DETAILS).map(({ label, value }, index) => ((0, jsx_runtime_1.jsx)(Labelled_1.Labelled, { label: label, children: (0, jsx_runtime_1.jsx)(CopyButton_1.CopyButton, { text: value, value: value }) }, index))) }), (0, jsx_runtime_1.jsxs)(Row_1.Row, { className: "items-center justify-between", children: [(0, jsx_runtime_1.jsx)(Row_1.Row, { children: "Has Etherlink been added?" }), (0, jsx_runtime_1.jsx)(TextButton_1.TextButton, { text: "Try again", onClick: () => handleChangeWallet(currentWallet) })] })] })) }))] })] })) : step === 'connected' ? ((0, jsx_runtime_1.jsxs)(react_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Header_1.Header, { title: "Account Details", onClose: onClose }), (0, jsx_runtime_1.jsxs)(Col_1.Col, { className: "gap-y-pageFrame overflow-y-scroll p-pageFrame", children: [(0, jsx_runtime_1.jsxs)(Col_1.Col, { className: "gap-y-pageFrame rounded-lg border border-solid border-line p-3", children: [(0, jsx_runtime_1.jsxs)(BaseButton_1.BaseButton, { className: "min-h-6 flex-row items-center gap-x-1.5", onClick: toggleShowShortAddress, children: [(0, jsx_runtime_1.jsx)(Row_1.Row, { className: "min-w[24px]", children: address && (0, jsx_runtime_1.jsx)(react_jazzicon_1.default, { diameter: 24, seed: (0, react_jazzicon_1.jsNumberForAddress)(address) }) }), (0, jsx_runtime_1.jsx)(Row_1.Row, { className: "break-all", children: showShortAddress ? shortAddress : address })] }), (0, jsx_runtime_1.jsxs)(Row_1.Row, { className: "justify-between", children: [(0, jsx_runtime_1.jsx)(CopyButton_1.CopyButton, { text: "Copy address", value: address }), (0, jsx_runtime_1.jsx)(HorizontalIconTextButton_1.HorizontalIconTextButton, { icon: "fileLinesRegular", text: "View on explorer", onClick: handleShowExplorer })] })] }), (0, jsx_runtime_1.jsxs)(Row_1.Row, { className: "items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(Row_1.Row, { className: "text-xs font-medium", children: ["Connected with ", currentWallet?.name] }), (0, jsx_runtime_1.jsx)(BaseButton_1.BaseButton, { className: "items-center justify-center rounded-lg border border-solid border-[#ff8989] bg-[#ffe1e1] p-4 text-primaryText", onClick: onDisconnect, children: "Disconnect" })] })] })] })) : undefined }), (0, jsx_runtime_1.jsx)(react_toastify_1.ToastContainer, { containerId: constants_1.TOAST_CONTAINER_ID, position: "top-center", autoClose: 5000, hideProgressBar: false, newestOnTop: false, closeOnClick: true, rtl: false, pauseOnFocusLoss: true, draggable: true, pauseOnHover: true, theme: "colored", transition: react_toastify_1.Bounce })] }), document.body);
});
exports.TConnectModal.displayName = 'TConnectModal';
//# sourceMappingURL=TConnectModal.js.map