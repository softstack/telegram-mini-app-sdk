import { ETHERLINK_GHOSTNET_CHAIN_ID, ETHERLINK_MAINNET_CHAIN_ID, joinUrl } from '@tconnect.io/core';
import { getOperatingSystem, openLink, randomUUID } from '@tconnect.io/dapp-utils';
import { EtherlinkNetwork } from '@tconnect.io/etherlink-api-types';
import { TConnectEtherlinkProvider } from '@tconnect.io/etherlink-provider';
import { TConnectTezosBeaconProvider, Network as TezosBeaconNetwork } from '@tconnect.io/tezos-beacon-provider';
import { TezosWcNetwork } from '@tconnect.io/tezos-wc-api-types';
import { TConnectTezosWcProvider } from '@tconnect.io/tezos-wc-provider';
import { clsx } from 'clsx';
import { Fragment, memo, MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { BeatLoader } from 'react-spinners';
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
import { Labelled } from '../components/Labelled';
import {
	ADD_ETHERLINK_GHOSTNET_URL,
	ADD_ETHERLINK_MAINNET_URL,
	ETHERLINK_GHOSTNET_DETAILS,
	ETHERLINK_GHOSTNET_EXPLORER_URL,
	ETHERLINK_MAINNET_DETAILS,
	ETHERLINK_MAINNET_EXPLORER_URL,
	NETWORKS,
	TEZOS_GHOSTNET_EXPLORER_URL,
	TEZOS_MAINNET_EXPLORER_URL,
	TOAST_CONTAINER_ID,
} from '../constants';
import { Network } from '../types';
import { handleError, nextVersion, useDarkMode, useVersionedState } from '../utils';

export type Step = 'connect' | 'connecting' | 'invalidChainId' | 'connected';

export interface TConnectModalProps {
	appName: string;
	appUrl: string;
	appIcon: string | undefined;
	bridgeUrl: string;
	apiKey: string;
	networkFilter: Array<'etherlink' | 'tezos'> | undefined;
	etherlinkNetwork: EtherlinkNetwork | undefined;
	tezosBeaconNetwork: TezosBeaconNetwork | undefined;
	tezosWcNetwork: TezosWcNetwork | undefined;
	step: Step;
	onChangeStep: (action: Step | ((prevStep: Step) => Step)) => void;
	currentNetwork: Network | undefined;
	onChangeCurrentNetwork: (network: Network) => void;
	currentWallet: Network['wallets'][0] | undefined;
	onChangeCurrentWallet: (wallet: Network['wallets'][0]) => void;
	etherlinkProvider: TConnectEtherlinkProvider | undefined;
	onChangeEtherlinkProvider: (provider: TConnectEtherlinkProvider, chainId: bigint) => void;
	tezosBeaconProvider: TConnectTezosBeaconProvider | undefined;
	onChangeTezosBeaconProvider: (provider: TConnectTezosBeaconProvider) => void;
	tezosWcProvider: TConnectTezosWcProvider | undefined;
	onChangeTezosWcProvider: (provider: TConnectTezosWcProvider) => void;
	onDisconnect: () => void;
	onClose: () => void;
}

/**
 * TConnectModal component is a memoized functional component that handles the connection process
 * for different blockchain networks and wallets. It provides a modal interface for users to select
 * a network, choose a wallet, and connect their account. The component manages various states and
 * effects to handle the connection process and display relevant information to the user.
 *
 * @param {string} bridgeUrl - The URL of the bridge server.
 * @param {string} apiKey - The API key for authentication.
 * @param {Array<string>} networkFilter - A filter for the networks to be displayed.
 * @param {string} step - The current step in the connection process.
 * @param {Function} onChangeStep - Callback to change the current step.
 * @param {Network} currentNetwork - The currently selected network.
 * @param {Function} onChangeCurrentNetwork - Callback to change the current network.
 * @param {Wallet} currentWallet - The currently selected wallet.
 * @param {Function} onChangeCurrentWallet - Callback to change the current wallet.
 * @param {Provider} etherlinkProvider - The provider for Etherlink based networks.
 * @param {Function} onChangeEtherlinkProvider - Callback to change the Etherlink provider.
 * @param {Provider} tezosBeaconProvider - The provider for Tezos Beacon.
 * @param {Function} onChangeTezosBeaconProvider - Callback to change the Tezos Beacon provider.
 * @param {Provider} tezosWcProvider - The provider for Tezos WalletConnect.
 * @param {Function} onChangeTezosWcProvider - Callback to change the Tezos WalletConnect provider.
 * @param {Function} onDisconnect - Callback to handle disconnection.
 * @param {Function} onClose - Callback to handle closing the modal.
 *
 * @returns {JSX.Element} The rendered TConnectModal component.
 */
export const TConnectModal = memo<TConnectModalProps>(
	({
		appName,
		appUrl,
		appIcon,
		bridgeUrl,
		apiKey,
		networkFilter,
		etherlinkNetwork = 'ghostnet',
		tezosBeaconNetwork = { type: 'ghostnet' },
		tezosWcNetwork = 'ghostnet',
		step,
		onChangeStep,
		currentNetwork,
		onChangeCurrentNetwork,
		currentWallet,
		onChangeCurrentWallet,
		etherlinkProvider,
		onChangeEtherlinkProvider,
		tezosBeaconProvider,
		onChangeTezosBeaconProvider,
		tezosWcProvider,
		onChangeTezosWcProvider,
		onDisconnect,
		onClose,
	}) => {
		const darkMode = useDarkMode();
		const backgroundElement = useRef(null);
		const [showNetworks, setShowNetworks] = useState(true);
		const [showWallets, setShowWallets] = useState(false);
		const [isConnectingError, setIsConnectingError] = useState(false);
		const [address, setAddress] = useVersionedState<string | undefined>(undefined);
		const [shortAddress, setShortAddress] = useVersionedState<string | undefined>(undefined);
		const [showShortAddress, setShowShortAddress] = useState(true);
		const [copiedAddress, setCopiedAddress] = useState(false);

		useEffect(() => {
			(async (): Promise<void> => {
				try {
					if (etherlinkProvider) {
						const version = nextVersion();
						const response = (await etherlinkProvider.request({ method: 'eth_accounts' })) as Array<string>;
						if (response.length > 0) {
							setAddress(version, response[0]);
							setShortAddress(version, `${response[0].slice(0, 12)}...${response[0].slice(-10)}`);
						}
					} else if (tezosBeaconProvider) {
						const version = nextVersion();
						const address = await tezosBeaconProvider.getPKH();
						setAddress(version, address);
						setShortAddress(version, `${address.slice(0, 10)}...${address.slice(-10)}`);
					} else if (tezosWcProvider) {
						const version = nextVersion();
						const address = await tezosWcProvider.getPKH();
						setAddress(version, address);
						setShortAddress(version, `${address.slice(0, 10)}...${address.slice(-10)}`);
					}
				} catch (error) {
					handleError(error);
				}
			})();
		}, [etherlinkProvider, tezosBeaconProvider, tezosWcProvider, setAddress, setShortAddress]);

		const handleBackground = useCallback(
			(event: MouseEvent<HTMLDivElement>) => {
				try {
					if (event.target === backgroundElement.current) {
						onClose();
					}
				} catch (error) {
					handleError(error);
				}
			},
			[onClose],
		);

		const handleChangeNetwork = useCallback(
			(network: Network) => {
				try {
					onChangeCurrentNetwork(network);
					setShowWallets(true);
				} catch (error) {
					handleError(error);
				}
			},
			[onChangeCurrentNetwork],
		);

		const filteredNetworks = useMemo(() => {
			try {
				return NETWORKS.filter(
					(network) => !networkFilter || networkFilter.includes(network.type === 'etherlink' ? 'etherlink' : 'tezos'),
				);
			} catch (error) {
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
						return currentNetwork.wallets.filter(
							(wallet) => !operatingSystem || wallet.supportedOperatingSystems.includes(operatingSystem),
						);
					}
					case 'tezos': {
						return currentNetwork.wallets.filter(
							(wallet) => !operatingSystem || wallet.supportedOperatingSystems.includes(operatingSystem),
						);
					}
				}
			} catch (error) {
				handleError(error);
			}
			return [];
		}, [currentNetwork]);

		const handleChangeWallet = useCallback(
			async (wallet: Network['wallets'][0]) => {
				try {
					onChangeStep('connecting');
					onChangeCurrentWallet(wallet);
					setIsConnectingError(false);
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
								if (
									(etherlinkNetwork === 'mainnet' && BigInt(info.chainId) === ETHERLINK_MAINNET_CHAIN_ID) ||
									(etherlinkNetwork === 'ghostnet' && BigInt(info.chainId) === ETHERLINK_GHOSTNET_CHAIN_ID)
								) {
									onChangeStep('connected');
								} else {
									onChangeStep('invalidChainId');
								}
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
				} catch (error) {
					setIsConnectingError(true);
					handleError(error);
				}
			},
			[
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
			],
		);

		// const handleAddEtherlink = useCallback(async () => {
		// 	try {
		// 		if (etherlinkProvider) {
		// 			await etherlinkProvider.request({
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
		// 					// '0x06F92f77c3F0D08f3c6efb468aD4f07972578DD1',
		// 				],
		// 			});
		// 		}
		// 	} catch (error) {
		// 		handleError(error);
		// 	}
		// }, [etherlinkProvider]);

		const toggleShowShortAddress = useCallback(() => {
			try {
				setShowShortAddress((prevShowShortAddress) => !prevShowShortAddress);
			} catch (error) {
				handleError(error);
			}
		}, []);

		const handleCopyAddress = useCallback(() => {
			try {
				if (address) {
					navigator.clipboard.writeText(address);
					setCopiedAddress(true);
					setTimeout(() => {
						setCopiedAddress(false);
					}, 1500);
				}
			} catch (error) {
				handleError(error);
			}
		}, [address]);

		const handleShowExplorer = useCallback(() => {
			try {
				if (currentWallet?.bridge === 'etherlink' && etherlinkProvider) {
					const url =
						etherlinkProvider?.network === 'ghostnet'
							? ETHERLINK_GHOSTNET_EXPLORER_URL
							: ETHERLINK_MAINNET_EXPLORER_URL;
					if (address) {
						openLink(joinUrl(url, 'address', address));
					} else {
						openLink(joinUrl(url));
					}
				} else if (tezosBeaconProvider || tezosWcProvider) {
					if (tezosBeaconProvider?.network.type === 'ghostnet' || tezosWcProvider?.network === 'ghostnet') {
						openLink(joinUrl(TEZOS_GHOSTNET_EXPLORER_URL, address ?? ''));
					} else {
						openLink(joinUrl(TEZOS_MAINNET_EXPLORER_URL, address ?? ''));
					}
				}
			} catch (error) {
				handleError(error);
			}
		}, [currentWallet, address, etherlinkProvider, tezosBeaconProvider, tezosWcProvider]);

		return createPortal(
			<Col
				ref={backgroundElement}
				className="fixed inset-0 z-[999999] justify-end bg-[#00000030] backdrop-blur"
				onClick={handleBackground}
			>
				<Col
					className={clsx(
						step === 'connected' ? 'max-h-3/4' : 'h-3/4',
						'rounded-t-3xl bg-white font-sans text-primaryText dark:bg-dark dark:text-primaryTextDark',
					)}
				>
					{step === 'connect' ? (
						<Fragment>
							<Header title="Connect Account" onClose={onClose} />
							<Col className="gap-y-6 overflow-y-scroll p-pageFrame">
								{filteredNetworks.length > 0 && (
									<Fragment>
										{filteredNetworks.length > 1 && (
											<Accordion title="Choose Network" open={showNetworks} onChangeOpen={setShowNetworks}>
												{filteredNetworks.map((network) => {
													const { name, icon } = network;
													return (
														<GridButton
															key={name}
															icon={icon}
															text={name}
															selected={network === currentNetwork}
															onClick={() => handleChangeNetwork(network)}
														/>
													);
												})}
											</Accordion>
										)}
										<Accordion title="Select Wallet" open={showWallets} onChangeOpen={setShowWallets}>
											{wallets.map((wallet) => {
												const { name, icon } = wallet;
												return (
													<GridButton
														key={name}
														icon={icon}
														text={name}
														selected={false}
														onClick={() => handleChangeWallet(wallet)}
													/>
												);
											})}
										</Accordion>
									</Fragment>
								)}
							</Col>
						</Fragment>
					) : step === 'connecting' ? (
						<Fragment>
							<Header title="Connecting" onClose={onClose} />
							<Col className="items-center gap-y-pageFrame overflow-y-scroll p-pageFrame">
								{isConnectingError ? (
									currentWallet && <TextButton text="Try again" onClick={() => handleChangeWallet(currentWallet)} />
								) : (
									<Fragment>
										<BeatLoader size={8} color={darkMode ? '#fff' : '#000'} />
										<Col className="items-center gap-y-2">
											<Row>Connecting Wallet</Row>
											{currentWallet && <Row className="text-sm">Please confirm in {currentWallet.name}</Row>}
										</Col>
									</Fragment>
								)}
								<Fragment>
									{currentWallet?.network === 'etherlink' && (
										<Fragment>
											<Row className="text-center text-red-500">
												If you have issues, please make sure Etherlink has been added to {currentWallet.name}
											</Row>
											<Row>
												You can either visit the link below via your wallet&rsquo;s browser or add Etherlink manually
											</Row>
											<CopyButton
												text={etherlinkNetwork === 'mainnet' ? ADD_ETHERLINK_MAINNET_URL : ADD_ETHERLINK_GHOSTNET_URL}
											/>
											<Col className="gap-y-3 self-start pt-2">
												{(etherlinkNetwork === 'mainnet' ? ETHERLINK_MAINNET_DETAILS : ETHERLINK_GHOSTNET_DETAILS).map(
													({ label, value }, index) => (
														<Labelled key={index} label={label}>
															<CopyButton text={value} />
														</Labelled>
													),
												)}
											</Col>
										</Fragment>
									)}
								</Fragment>
							</Col>
						</Fragment>
					) : step === 'invalidChainId' ? (
						<Fragment>
							<Header title="Unsupported Network" onClose={onClose} />
							<Col className="gap-y-pageFrame overflow-y-scroll p-pageFrame">
								<Row>Please select Etherlink in {currentWallet?.name}</Row>
								<Row>If Etherlink has not been added to {currentWallet?.name} yet, you can find a how-to here</Row>
								<TextButton text="I have selected Etherlink" onClick={onClose} />
								{/* <TextButton text="Add Etherlink" onClick={handleAddEtherlink} /> */}
							</Col>
						</Fragment>
					) : step === 'connected' ? (
						<Fragment>
							<Header title="Account Details" onClose={onClose} />
							<Col className="gap-y-pageFrame overflow-y-scroll p-pageFrame">
								<Col className="gap-y-pageFrame rounded-lg border border-solid border-lineGrey p-3">
									<BaseButton className="min-h-6 flex-row items-center gap-x-1.5" onClick={toggleShowShortAddress}>
										<Row className="min-w[24px]">
											{address && <Jazzicon diameter={24} seed={jsNumberForAddress(address)} />}
										</Row>
										<Row className="break-all">{showShortAddress ? shortAddress : address}</Row>
									</BaseButton>
									<Row className="justify-between">
										<HorizontalIconTextButton
											icon={copiedAddress ? 'checkSolid' : 'copyRegular'}
											iconColorSuccess={copiedAddress}
											text="Copy address"
											onClick={handleCopyAddress}
										/>
										<HorizontalIconTextButton
											icon="fileLinesRegular"
											text="View on explorer"
											onClick={handleShowExplorer}
										/>
									</Row>
								</Col>
								<Row className="items-center justify-between">
									<Row className="text-xs font-medium">Connected with {currentWallet?.name}</Row>
									<BaseButton
										className="items-center justify-center rounded-lg border border-solid border-[#ff8989] bg-[#ffe1e1] p-4 text-primaryText"
										onClick={onDisconnect}
									>
										Disconnect
									</BaseButton>
								</Row>
							</Col>
						</Fragment>
					) : undefined}
				</Col>
				<ToastContainer
					containerId={TOAST_CONTAINER_ID}
					position="top-center"
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme="colored"
					transition={Bounce}
				/>
			</Col>,
			document.body,
		);
	},
);

TConnectModal.displayName = 'TConnectModal';
