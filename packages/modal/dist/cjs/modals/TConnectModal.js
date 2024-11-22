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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TConnectModal = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const core_1 = require("@tconnect.io/core");
const dapp_utils_1 = require("@tconnect.io/dapp-utils");
const evm_provider_1 = require("@tconnect.io/evm-provider");
const tezos_beacon_provider_1 = require("@tconnect.io/tezos-beacon-provider");
const tezos_wc_provider_1 = require("@tconnect.io/tezos-wc-provider");
const sdk_1 = __importDefault(require("@twa-dev/sdk"));
const clsx_1 = require("clsx");
const react_1 = require("react");
const react_dom_1 = require("react-dom");
const react_jazzicon_1 = __importStar(require("react-jazzicon"));
const react_spinners_1 = require("react-spinners");
const Accordion_1 = require("../components/Accordion");
const BaseButton_1 = require("../components/buttons/BaseButton");
const GridButton_1 = require("../components/buttons/GridButton");
const HorizontalIconTextButton_1 = require("../components/buttons/HorizontalIconTextButton");
const TextButton_1 = require("../components/buttons/TextButton");
const Col_1 = require("../components/flex/Col");
const Row_1 = require("../components/flex/Row");
const Header_1 = require("../components/Header");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
exports.TConnectModal = (0, react_1.memo)(({ bridgeUrl, apiKey, networkFilter, genericWalletUrl, step, onChangeStep, currentNetwork, onChangeCurrentNetwork, currentWallet, onChangeCurrentWallet, evmProvider, onChangeEvmProvider, tezosBeaconProvider, onChangeTezosBeaconProvider, tezosWcProvider, onChangeTezosWcProvider, onDisconnect, onClose, onError, }) => {
    const darkMode = (0, utils_1.useDarkMode)();
    const backgroundElement = (0, react_1.useRef)(null);
    const [showNetworks, setShowNetworks] = (0, react_1.useState)(true);
    const [showWallets, setShowWallets] = (0, react_1.useState)(false);
    const [showGenericWallets, setShowGenericWallets] = (0, react_1.useState)(false);
    const [address, setAddress] = (0, utils_1.useVersionedState)(undefined);
    const [shortAddress, setShortAddress] = (0, utils_1.useVersionedState)(undefined);
    const [showShortAddress, setShowShortAddress] = (0, react_1.useState)(true);
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
                onError(error);
            }
        })();
    }, [evmProvider, tezosBeaconProvider, tezosWcProvider, setAddress, setShortAddress, onError]);
    const handleBackground = (0, react_1.useCallback)((event) => {
        try {
            if (event.target === backgroundElement.current) {
                onClose();
            }
        }
        catch (error) {
            onError(error);
        }
    }, [onClose, onError]);
    const handleChangeNetwork = (0, react_1.useCallback)((network) => {
        try {
            onChangeCurrentNetwork(network);
            setShowWallets(true);
            setShowGenericWallets(true);
        }
        catch (error) {
            onError(error);
        }
    }, [onChangeCurrentNetwork, onError]);
    const filteredNetworks = (0, react_1.useMemo)(() => {
        try {
            return constants_1.NETWORKS.filter((network) => !networkFilter || networkFilter.includes(network.type === 'evm' ? 'etherlink' : 'tezos'));
        }
        catch (error) {
            onError(error);
        }
        return [];
    }, [networkFilter, onError]);
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
                    return currentNetwork.wallets.filter((wallet) => wallet.walletApp !== '_generic_' &&
                        (!operatingSystem || wallet.supportedOperatingSystems.includes(operatingSystem)));
                }
            }
        }
        catch (error) {
            onError(error);
        }
        return [];
    }, [currentNetwork, onError]);
    const genericWallets = (0, react_1.useMemo)(() => {
        try {
            const operatingSystem = (0, dapp_utils_1.getOperatingSystem)();
            if (currentNetwork?.type === 'tezos') {
                return currentNetwork.wallets.filter((wallet) => wallet.walletApp === '_generic_' &&
                    (!operatingSystem || wallet.supportedOperatingSystems.includes(operatingSystem)));
            }
        }
        catch (error) {
            onError(error);
        }
        return [];
    }, [currentNetwork, onError]);
    const handleChangeWallet = (0, react_1.useCallback)(async (wallet) => {
        try {
            onChangeStep('connecting');
            onChangeCurrentWallet(wallet);
            switch (wallet.network) {
                case 'evm': {
                    const provider = new evm_provider_1.TConnectEvmProvider({ bridgeUrl, walletApp: wallet.walletApp, apiKey });
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
                                bridgeUrl,
                                walletApp: wallet.walletApp,
                                secretSeed: crypto.randomUUID(),
                                apiKey,
                                network: { type: 'mainnet' },
                                genericWalletUrl,
                            });
                            await provider.permissionRequest();
                            onChangeTezosBeaconProvider(provider);
                            break;
                        }
                        case 'wc': {
                            const provider = new tezos_wc_provider_1.TConnectTezosWcProvider({
                                bridgeUrl,
                                walletApp: wallet.walletApp,
                                apiKey,
                                network: 'mainnet',
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
        bridgeUrl,
        apiKey,
        genericWalletUrl,
        onChangeEvmProvider,
        onChangeTezosBeaconProvider,
        onChangeTezosWcProvider,
        onError,
    ]);
    // const handleAddEtherlink = useCallback(async () => {
    // 	try {
    // 		if (evmProvider) {
    // 			await evmProvider.request({
    // 				method: 'wallet_addEthereumChain',
    // 				params: [
    // 					{
    // 						chainId: '0xa729',
    // 						chainName: 'Etherlink Mainnet',
    // 						nativeCurrency: {
    // 							name: 'Tezos',
    // 							symbol: 'XTZ',
    // 							decimals: 18,
    // 						},
    // 						rpcUrls: ['https://node.mainnet.etherlink.com'],
    // 						blockExplorerUrls: ['https://explorer.etherlink.com'],
    // 					},
    // 				],
    // 			});
    // 		}
    // 	} catch (error) {
    // 		onError(error);
    // 	}
    // }, [evmProvider, onError]);
    const toggleShowShortAddress = (0, react_1.useCallback)(() => {
        try {
            setShowShortAddress((prevShowShortAddress) => !prevShowShortAddress);
        }
        catch (error) {
            onError(error);
        }
    }, [onError]);
    const handleCopyAddress = (0, react_1.useCallback)(() => {
        try {
            if (address) {
                navigator.clipboard.writeText(address);
            }
        }
        catch (error) {
            onError(error);
        }
    }, [address, onError]);
    const handleShowExplorer = (0, react_1.useCallback)(() => {
        try {
            if (currentWallet) {
                switch (currentWallet.network) {
                    case 'evm': {
                        sdk_1.default.openLink(`https://explorer.etherlink.com/address/${address}`);
                        break;
                    }
                    case 'tezos': {
                        sdk_1.default.openLink(`https://tzkt.io/${address}`);
                        break;
                    }
                }
            }
        }
        catch (error) {
            onError(error);
        }
    }, [currentWallet, address, onError]);
    return (0, react_dom_1.createPortal)((0, jsx_runtime_1.jsx)(Col_1.Col, { ref: backgroundElement, className: "fixed inset-0 z-[999999] justify-end bg-[#00000030] backdrop-blur", onClick: handleBackground, children: (0, jsx_runtime_1.jsx)(Col_1.Col, { className: (0, clsx_1.clsx)(step === 'connected' ? 'max-h-3/4' : 'h-3/4', 'rounded-t-3xl bg-white font-sans text-primaryText dark:bg-dark dark:text-primaryTextDark'), children: step === 'connect' ? ((0, jsx_runtime_1.jsxs)(react_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Header_1.Header, { title: "Connect Account", onClose: onClose }), (0, jsx_runtime_1.jsx)(Col_1.Col, { className: "gap-y-6 overflow-y-scroll p-pageFrame", children: filteredNetworks.length > 0 && ((0, jsx_runtime_1.jsxs)(react_1.Fragment, { children: [filteredNetworks.length > 1 && ((0, jsx_runtime_1.jsx)(Accordion_1.Accordion, { title: "Choose Network", open: showNetworks, onChangeOpen: setShowNetworks, children: filteredNetworks.map((network) => {
                                        const { name, icon } = network;
                                        return ((0, jsx_runtime_1.jsx)(GridButton_1.GridButton, { icon: icon, text: name, selected: network === currentNetwork, onClick: () => handleChangeNetwork(network) }, name));
                                    }) })), (0, jsx_runtime_1.jsx)(Accordion_1.Accordion, { title: "Select Wallet", open: showWallets, onChangeOpen: setShowWallets, children: wallets.map((wallet) => {
                                        const { name, icon } = wallet;
                                        return ((0, jsx_runtime_1.jsx)(GridButton_1.GridButton, { icon: icon, text: name, selected: false, onClick: () => handleChangeWallet(wallet) }, name));
                                    }) }), genericWallets.length > 0 && ((0, jsx_runtime_1.jsx)(Accordion_1.Accordion, { title: "Select Experimental Wallet", open: showGenericWallets, onChangeOpen: setShowGenericWallets, children: genericWallets.map((wallet) => {
                                        const { name, icon } = wallet;
                                        return ((0, jsx_runtime_1.jsx)(GridButton_1.GridButton, { icon: icon, text: name, selected: false, onClick: () => handleChangeWallet(wallet) }, name));
                                    }) }))] })) })] })) : step === 'connecting' ? ((0, jsx_runtime_1.jsxs)(react_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Header_1.Header, { title: "Connecting", onClose: onClose }), (0, jsx_runtime_1.jsxs)(Col_1.Col, { className: "items-center gap-y-pageFrame overflow-y-scroll p-pageFrame", children: [(0, jsx_runtime_1.jsx)(react_spinners_1.BeatLoader, { size: 8, color: darkMode ? '#fff' : '#000' }), (0, jsx_runtime_1.jsxs)(Col_1.Col, { className: "items-center gap-y-2", children: [(0, jsx_runtime_1.jsx)(Row_1.Row, { children: "Connecting Wallet" }), currentWallet && (0, jsx_runtime_1.jsxs)(Row_1.Row, { className: "text-sm", children: ["Please confirm in ", currentWallet.name, " app"] })] })] })] })) : step === 'invalidChainId' ? ((0, jsx_runtime_1.jsxs)(react_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Header_1.Header, { title: "Unsupported Network", onClose: onClose }), (0, jsx_runtime_1.jsxs)(Col_1.Col, { className: "gap-y-pageFrame overflow-y-scroll p-pageFrame", children: [(0, jsx_runtime_1.jsxs)(Row_1.Row, { children: ["Please select Etherlink in ", currentWallet?.name] }), (0, jsx_runtime_1.jsxs)(Row_1.Row, { children: ["If Etherlink has not been added to ", currentWallet?.name, " yet, you can find a how-to here"] }), (0, jsx_runtime_1.jsx)(TextButton_1.TextButton, { text: "I have selected Etherlink", onClick: onClose })] })] })) : step === 'connected' ? ((0, jsx_runtime_1.jsxs)(react_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Header_1.Header, { title: "Account Details", onClose: onClose }), (0, jsx_runtime_1.jsxs)(Col_1.Col, { className: "gap-y-pageFrame overflow-y-scroll p-pageFrame", children: [(0, jsx_runtime_1.jsxs)(Col_1.Col, { className: "gap-y-pageFrame rounded-lg border border-solid border-lineGrey p-3", children: [(0, jsx_runtime_1.jsxs)(BaseButton_1.BaseButton, { className: "min-h-6 flex-row items-center gap-x-1.5", onClick: toggleShowShortAddress, children: [(0, jsx_runtime_1.jsx)(Row_1.Row, { className: "min-w[24px]", children: address && (0, jsx_runtime_1.jsx)(react_jazzicon_1.default, { diameter: 24, seed: (0, react_jazzicon_1.jsNumberForAddress)(address) }) }), (0, jsx_runtime_1.jsx)(Row_1.Row, { className: "break-all", children: showShortAddress ? shortAddress : address })] }), (0, jsx_runtime_1.jsxs)(Row_1.Row, { className: "justify-between", children: [(0, jsx_runtime_1.jsx)(HorizontalIconTextButton_1.HorizontalIconTextButton, { icon: "copyRegular", text: "Copy address", onClick: handleCopyAddress }), (0, jsx_runtime_1.jsx)(HorizontalIconTextButton_1.HorizontalIconTextButton, { icon: "fileLinesRegular", text: "View on explorer", onClick: handleShowExplorer })] })] }), (0, jsx_runtime_1.jsxs)(Row_1.Row, { className: "items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(Row_1.Row, { className: "text-xs font-medium", children: ["Connected with ", currentWallet?.name] }), (0, jsx_runtime_1.jsx)(BaseButton_1.BaseButton, { className: "items-center justify-center rounded-lg border border-solid border-[#ff8989] bg-[#ffe1e1] p-4 text-primaryText", onClick: onDisconnect, children: "Disconnect" })] })] })] })) : undefined }) }), document.body);
});
exports.TConnectModal.displayName = 'TConnectModal';
//# sourceMappingURL=TConnectModal.js.map