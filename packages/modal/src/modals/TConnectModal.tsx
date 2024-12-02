import { ETHERLINK_CHAIN_ID } from '@tconnect.io/core';
import { getOperatingSystem } from '@tconnect.io/dapp-utils';
import { TConnectEvmProvider } from '@tconnect.io/evm-provider';
import { TConnectTezosBeaconProvider, Network as TezosBeaconNetwork } from '@tconnect.io/tezos-beacon-provider';
import { TConnectTezosWcProvider, Network as TezosWcNetwork } from '@tconnect.io/tezos-wc-provider';
import WebApp from '@twa-dev/sdk';
import { clsx } from 'clsx';
import { Fragment, memo, MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { Network } from '../types';
import { nextVersion, useDarkMode, useVersionedState } from '../utils';

export type Step = 'connect' | 'connecting' | 'invalidChainId' | 'connected';

export interface TConnectModalProps {
	appName: string;
	appUrl: string;
	appIcon: string | undefined;
	bridgeUrl: string;
	apiKey: string;
	networkFilter: Array<'etherlink' | 'tezos'> | undefined;
	tezosBeaconNetwork: TezosBeaconNetwork | undefined;
	tezosWcNetwork: TezosWcNetwork | undefined;
	step: Step;
	onChangeStep: (action: Step | ((prevStep: Step) => Step)) => void;
	currentNetwork: Network | undefined;
	onChangeCurrentNetwork: (network: Network) => void;
	currentWallet: Network['wallets'][0] | undefined;
	onChangeCurrentWallet: (wallet: Network['wallets'][0]) => void;
	evmProvider: TConnectEvmProvider | undefined;
	onChangeEvmProvider: (provider: TConnectEvmProvider, chainId: bigint) => void;
	tezosBeaconProvider: TConnectTezosBeaconProvider | undefined;
	onChangeTezosBeaconProvider: (provider: TConnectTezosBeaconProvider) => void;
	tezosWcProvider: TConnectTezosWcProvider | undefined;
	onChangeTezosWcProvider: (provider: TConnectTezosWcProvider) => void;
	onDisconnect: () => void;
	onClose: () => void;
	onError: (error: unknown) => void;
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
 * @param {Provider} evmProvider - The provider for EVM-based networks.
 * @param {Function} onChangeEvmProvider - Callback to change the EVM provider.
 * @param {Provider} tezosBeaconProvider - The provider for Tezos Beacon.
 * @param {Function} onChangeTezosBeaconProvider - Callback to change the Tezos Beacon provider.
 * @param {Provider} tezosWcProvider - The provider for Tezos WalletConnect.
 * @param {Function} onChangeTezosWcProvider - Callback to change the Tezos WalletConnect provider.
 * @param {Function} onDisconnect - Callback to handle disconnection.
 * @param {Function} onClose - Callback to handle closing the modal.
 * @param {Function} onError - Callback to handle errors.
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
		tezosBeaconNetwork,
		tezosWcNetwork,
		step,
		onChangeStep,
		currentNetwork,
		onChangeCurrentNetwork,
		currentWallet,
		onChangeCurrentWallet,
		evmProvider,
		onChangeEvmProvider,
		tezosBeaconProvider,
		onChangeTezosBeaconProvider,
		tezosWcProvider,
		onChangeTezosWcProvider,
		onDisconnect,
		onClose,
		onError,
	}) => {
		const darkMode = useDarkMode();
		const backgroundElement = useRef(null);
		const [showNetworks, setShowNetworks] = useState(true);
		const [showWallets, setShowWallets] = useState(false);
		const [address, setAddress] = useVersionedState<string | undefined>(undefined);
		const [shortAddress, setShortAddress] = useVersionedState<string | undefined>(undefined);
		const [showShortAddress, setShowShortAddress] = useState(true);
		const [copied, setCopied] = useState(false);

		useEffect(() => {
			(async (): Promise<void> => {
				try {
					if (evmProvider) {
						const version = nextVersion();
						const response = (await evmProvider.request({ method: 'eth_accounts' })) as Array<string>;
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
					onError(error);
				}
			})();
		}, [evmProvider, tezosBeaconProvider, tezosWcProvider, setAddress, setShortAddress, onError]);

		const handleBackground = useCallback(
			(event: MouseEvent<HTMLDivElement>) => {
				try {
					if (event.target === backgroundElement.current) {
						onClose();
					}
				} catch (error) {
					onError(error);
				}
			},
			[onClose, onError],
		);

		const handleChangeNetwork = useCallback(
			(network: Network) => {
				try {
					onChangeCurrentNetwork(network);
					setShowWallets(true);
				} catch (error) {
					onError(error);
				}
			},
			[onChangeCurrentNetwork, onError],
		);

		const filteredNetworks = useMemo(() => {
			try {
				return NETWORKS.filter(
					(network) => !networkFilter || networkFilter.includes(network.type === 'evm' ? 'etherlink' : 'tezos'),
				);
			} catch (error) {
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
				onError(error);
			}
			return [];
		}, [currentNetwork, onError]);

		const handleChangeWallet = useCallback(
			async (wallet: Network['wallets'][0]) => {
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
								} else {
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
				} catch (error) {
					onError(error);
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
				tezosBeaconNetwork,
				tezosWcNetwork,
				onChangeEvmProvider,
				onChangeTezosBeaconProvider,
				onChangeTezosWcProvider,
				onError,
			],
		);

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

		const toggleShowShortAddress = useCallback(() => {
			try {
				setShowShortAddress((prevShowShortAddress) => !prevShowShortAddress);
			} catch (error) {
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
			} catch (error) {
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
			} catch (error) {
				onError(error);
			}
		}, [currentWallet, address, onError]);

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
								<BeatLoader size={8} color={darkMode ? '#fff' : '#000'} />
								<Col className="items-center gap-y-2">
									<Row>Connecting Wallet</Row>
									{currentWallet && <Row className="text-sm">Please confirm in {currentWallet.name} app</Row>}
								</Col>
							</Col>
						</Fragment>
					) : step === 'invalidChainId' ? (
						<Fragment>
							<Header title="Unsupported Network" onClose={onClose} />
							<Col className="gap-y-pageFrame overflow-y-scroll p-pageFrame">
								{/* <TextButton text="Add Etherlink" onClick={handleAddEtherlink} /> */}
								<Row>Please select Etherlink in {currentWallet?.name}</Row>
								<Row>If Etherlink has not been added to {currentWallet?.name} yet, you can find a how-to here</Row>
								<TextButton text="I have selected Etherlink" onClick={onClose} />
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
											icon={copied ? 'checkSolid' : 'copyRegular'}
											iconColorSuccess={copied}
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
			</Col>,
			document.body,
		);
	},
);

TConnectModal.displayName = 'TConnectModal';
