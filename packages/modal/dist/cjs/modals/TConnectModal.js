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
const evm_provider_1 = require("@tconnect.io/evm-provider");
const tezos_beacon_provider_1 = require("@tconnect.io/tezos-beacon-provider");
const tezos_wc_provider_1 = require("@tconnect.io/tezos-wc-provider");
const clsx_1 = require("clsx");
const react_1 = require("react");
const react_dom_1 = require("react-dom");
const react_jazzicon_1 = __importStar(require("react-jazzicon"));
const react_spinners_1 = require("react-spinners");
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
const Labelled_1 = require("../components/Labelled");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
exports.TConnectModal = (0, react_1.memo)(({ appName, appUrl, appIcon, bridgeUrl, apiKey, networkFilter, evmNetwork = 'ghostnet', tezosBeaconNetwork = { type: 'ghostnet' }, tezosWcNetwork = 'ghostnet', step, onChangeStep, currentNetwork, onChangeCurrentNetwork, currentWallet, onChangeCurrentWallet, evmProvider, onChangeEvmProvider, tezosBeaconProvider, onChangeTezosBeaconProvider, tezosWcProvider, onChangeTezosWcProvider, onDisconnect, onClose, }) => {
    const darkMode = (0, utils_1.useDarkMode)();
    const backgroundElement = (0, react_1.useRef)(null);
    const [showNetworks, setShowNetworks] = (0, react_1.useState)(true);
    const [showWallets, setShowWallets] = (0, react_1.useState)(false);
    const [isConnectingError, setIsConnectingError] = (0, react_1.useState)(false);
    const [address, setAddress] = (0, utils_1.useVersionedState)(undefined);
    const [shortAddress, setShortAddress] = (0, utils_1.useVersionedState)(undefined);
    const [showShortAddress, setShowShortAddress] = (0, react_1.useState)(true);
    const [copiedAddress, setCopiedAddress] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        (async () => {
            try {
                if (evmProvider) {
                    const version = (0, utils_1.nextVersion)();
                    const response = (await evmProvider.request({ method: 'eth_accounts' }));
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
    }, [evmProvider, tezosBeaconProvider, tezosWcProvider, setAddress, setShortAddress]);
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
            return constants_1.NETWORKS.filter((network) => !networkFilter || networkFilter.includes(network.type === 'evm' ? 'etherlink' : 'tezos'));
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
                case 'evm': {
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
            onChangeStep('connecting');
            onChangeCurrentWallet(wallet);
            setIsConnectingError(false);
            switch (wallet.network) {
                case 'evm': {
                    const provider = new evm_provider_1.TConnectEvmProvider({
                        appName,
                        appUrl,
                        appIcon,
                        bridgeUrl,
                        walletApp: wallet.walletApp,
                        apiKey,
                        network: evmNetwork,
                    });
                    provider.once('connect', (info) => {
                        if (BigInt(info.chainId) === core_1.ETHERLINK_CHAIN_ID) {
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
            setIsConnectingError(true);
            (0, utils_1.handleError)(error);
        }
    }, [
        onChangeStep,
        onChangeCurrentWallet,
        appName,
        appUrl,
        appIcon,
        bridgeUrl,
        apiKey,
        evmNetwork,
        tezosBeaconNetwork,
        tezosWcNetwork,
        onChangeEvmProvider,
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
    const handleCopyAddress = (0, react_1.useCallback)(() => {
        try {
            if (address) {
                navigator.clipboard.writeText(address);
                setCopiedAddress(true);
                setTimeout(() => {
                    setCopiedAddress(false);
                }, 1500);
            }
        }
        catch (error) {
            (0, utils_1.handleError)(error);
        }
    }, [address]);
    const handleShowExplorer = (0, react_1.useCallback)(() => {
        try {
            if (currentWallet) {
                switch (currentWallet.network) {
                    case 'evm': {
                        (0, dapp_utils_1.openLink)(`https://explorer.etherlink.com/address/${address}`);
                        break;
                    }
                    case 'tezos': {
                        (0, dapp_utils_1.openLink)(`https://tzkt.io/${address}`);
                        break;
                    }
                }
            }
        }
        catch (error) {
            (0, utils_1.handleError)(error);
        }
    }, [currentWallet, address]);
    return (0, react_dom_1.createPortal)((0, jsx_runtime_1.jsxs)(Col_1.Col, { ref: backgroundElement, className: "fixed inset-0 z-[999999] justify-end bg-[#00000030] backdrop-blur", onClick: handleBackground, children: [(0, jsx_runtime_1.jsx)(Col_1.Col, { className: (0, clsx_1.clsx)(step === 'connected' ? 'max-h-3/4' : 'h-3/4', 'rounded-t-3xl bg-white font-sans text-primaryText dark:bg-dark dark:text-primaryTextDark'), children: step === 'connect' ? ((0, jsx_runtime_1.jsxs)(react_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Header_1.Header, { title: "Connect Account", onClose: onClose }), (0, jsx_runtime_1.jsx)(Col_1.Col, { className: "gap-y-6 overflow-y-scroll p-pageFrame", children: filteredNetworks.length > 0 && ((0, jsx_runtime_1.jsxs)(react_1.Fragment, { children: [filteredNetworks.length > 1 && ((0, jsx_runtime_1.jsx)(Accordion_1.Accordion, { title: "Choose Network", open: showNetworks, onChangeOpen: setShowNetworks, children: filteredNetworks.map((network) => {
                                            const { name, icon } = network;
                                            return ((0, jsx_runtime_1.jsx)(GridButton_1.GridButton, { icon: icon, text: name, selected: network === currentNetwork, onClick: () => handleChangeNetwork(network) }, name));
                                        }) })), (0, jsx_runtime_1.jsx)(Accordion_1.Accordion, { title: "Select Wallet", open: showWallets, onChangeOpen: setShowWallets, children: wallets.map((wallet) => {
                                            const { name, icon } = wallet;
                                            return ((0, jsx_runtime_1.jsx)(GridButton_1.GridButton, { icon: icon, text: name, selected: false, onClick: () => handleChangeWallet(wallet) }, name));
                                        }) })] })) })] })) : step === 'connecting' ? ((0, jsx_runtime_1.jsxs)(react_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Header_1.Header, { title: "Connecting", onClose: onClose }), (0, jsx_runtime_1.jsx)(Col_1.Col, { className: "items-center gap-y-pageFrame overflow-y-scroll p-pageFrame", children: isConnectingError ? (currentWallet && ((0, jsx_runtime_1.jsxs)(react_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(TextButton_1.TextButton, { text: "Try again", onClick: () => handleChangeWallet(currentWallet) }), currentWallet.network === 'evm' && ((0, jsx_runtime_1.jsxs)(react_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Row_1.Row, { className: "text-center text-red-500", children: ["If you have issues, please make sure Etherlink has been added to ", currentWallet.name] }), (0, jsx_runtime_1.jsx)(Row_1.Row, { children: "You can either visit the link below via your wallet\u2019s browser or add Etherlink manually" }), (0, jsx_runtime_1.jsx)(CopyButton_1.CopyButton, { text: evmNetwork === 'mainnet' ? constants_1.ADD_ETHERLINK_MAINNET_URL : constants_1.ADD_ETHERLINK_GHOSTNET_URL }), (0, jsx_runtime_1.jsx)(Col_1.Col, { className: "gap-y-3 self-start pt-2", children: (evmNetwork === 'mainnet' ? constants_1.ETHERLINK_MAINNET_DETAILS : constants_1.ETHERLINK_GHOSTNET_DETAILS).map(({ label, value }, index) => ((0, jsx_runtime_1.jsx)(Labelled_1.Labelled, { label: label, children: (0, jsx_runtime_1.jsx)(CopyButton_1.CopyButton, { text: value }) }, index))) })] }))] }))) : ((0, jsx_runtime_1.jsxs)(react_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(react_spinners_1.BeatLoader, { size: 8, color: darkMode ? '#fff' : '#000' }), (0, jsx_runtime_1.jsxs)(Col_1.Col, { className: "items-center gap-y-2", children: [(0, jsx_runtime_1.jsx)(Row_1.Row, { children: "Connecting Wallet" }), currentWallet && (0, jsx_runtime_1.jsxs)(Row_1.Row, { className: "text-sm", children: ["Please confirm in ", currentWallet.name] })] })] })) })] })) : step === 'invalidChainId' ? ((0, jsx_runtime_1.jsxs)(react_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Header_1.Header, { title: "Unsupported Network", onClose: onClose }), (0, jsx_runtime_1.jsxs)(Col_1.Col, { className: "gap-y-pageFrame overflow-y-scroll p-pageFrame", children: [(0, jsx_runtime_1.jsxs)(Row_1.Row, { children: ["Please select Etherlink in ", currentWallet?.name] }), (0, jsx_runtime_1.jsxs)(Row_1.Row, { children: ["If Etherlink has not been added to ", currentWallet?.name, " yet, you can find a how-to here"] }), (0, jsx_runtime_1.jsx)(TextButton_1.TextButton, { text: "I have selected Etherlink", onClick: onClose })] })] })) : step === 'connected' ? ((0, jsx_runtime_1.jsxs)(react_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Header_1.Header, { title: "Account Details", onClose: onClose }), (0, jsx_runtime_1.jsxs)(Col_1.Col, { className: "gap-y-pageFrame overflow-y-scroll p-pageFrame", children: [(0, jsx_runtime_1.jsxs)(Col_1.Col, { className: "gap-y-pageFrame rounded-lg border border-solid border-lineGrey p-3", children: [(0, jsx_runtime_1.jsxs)(BaseButton_1.BaseButton, { className: "min-h-6 flex-row items-center gap-x-1.5", onClick: toggleShowShortAddress, children: [(0, jsx_runtime_1.jsx)(Row_1.Row, { className: "min-w[24px]", children: address && (0, jsx_runtime_1.jsx)(react_jazzicon_1.default, { diameter: 24, seed: (0, react_jazzicon_1.jsNumberForAddress)(address) }) }), (0, jsx_runtime_1.jsx)(Row_1.Row, { className: "break-all", children: showShortAddress ? shortAddress : address })] }), (0, jsx_runtime_1.jsxs)(Row_1.Row, { className: "justify-between", children: [(0, jsx_runtime_1.jsx)(HorizontalIconTextButton_1.HorizontalIconTextButton, { icon: copiedAddress ? 'checkSolid' : 'copyRegular', iconColorSuccess: copiedAddress, text: "Copy address", onClick: handleCopyAddress }), (0, jsx_runtime_1.jsx)(HorizontalIconTextButton_1.HorizontalIconTextButton, { icon: "fileLinesRegular", text: "View on explorer", onClick: handleShowExplorer })] })] }), (0, jsx_runtime_1.jsxs)(Row_1.Row, { className: "items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(Row_1.Row, { className: "text-xs font-medium", children: ["Connected with ", currentWallet?.name] }), (0, jsx_runtime_1.jsx)(BaseButton_1.BaseButton, { className: "items-center justify-center rounded-lg border border-solid border-[#ff8989] bg-[#ffe1e1] p-4 text-primaryText", onClick: onDisconnect, children: "Disconnect" })] })] })] })) : undefined }), (0, jsx_runtime_1.jsx)(react_toastify_1.ToastContainer, { containerId: constants_1.TOAST_CONTAINER_ID, position: "top-center", autoClose: 5000, hideProgressBar: false, newestOnTop: false, closeOnClick: true, rtl: false, pauseOnFocusLoss: true, draggable: true, pauseOnHover: true, theme: "colored", transition: react_toastify_1.Bounce })] }), document.body);
});
exports.TConnectModal.displayName = 'TConnectModal';
//# sourceMappingURL=TConnectModal.js.map