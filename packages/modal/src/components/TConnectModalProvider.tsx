import { ETHERLINK_GHOSTNET_CHAIN_ID, ETHERLINK_MAINNET_CHAIN_ID } from '@tconnect.io/core';
import { EvmNetwork as EvmNetworkType } from '@tconnect.io/evm-api-types';
import { TConnectEvmProvider } from '@tconnect.io/evm-provider';
import { TConnectTezosBeaconProvider, Network as TezosBeaconNetwork } from '@tconnect.io/tezos-beacon-provider';
import { TezosWcNetwork } from '@tconnect.io/tezos-wc-api-types';
import { TConnectTezosWcProvider } from '@tconnect.io/tezos-wc-provider';
import { createContext, memo, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
	EVM_PROVIDER_STORAGE_KEY,
	NETWORKS,
	TEZOS_BEACON_PROVIDER_STORAGE_KEY,
	TEZOS_WC_PROVIDER_STORAGE_KEY,
} from '../constants';
import { Step, TConnectModal } from '../modals/TConnectModal';
import { EvmNetwork, Network, TConnectModalContextValue, TezosNetwork } from '../types';
import { handleError, nextVersion, useVersionedState } from '../utils';

/**
 * Context for managing the state and actions related to the TConnect modal.
 *
 * @typedef {Object} TConnectModalContextValue
 * @property {Function} openModal - Function to open the modal.
 * @property {Function} closeModal - Function to close the modal.
 * @property {any} evmProvider - Ethereum provider, if available.
 * @property {any} tezosBeaconProvider - Tezos Beacon provider, if available.
 * @property {any} tezosWcProvider - Tezos WalletConnect provider, if available.
 * @property {boolean} connected - Boolean indicating if a connection is established.
 */
export const TConnectModalContext = createContext<TConnectModalContextValue>({
	openModal: () => undefined,
	closeModal: () => undefined,
	evmProvider: undefined,
	tezosBeaconProvider: undefined,
	tezosWcProvider: undefined,
	connected: false,
});

export interface TConnectModalProviderProps {
	appName: string;
	appUrl: string;
	appIcon?: string;
	bridgeUrl: string;
	apiKey: string;
	networkFilter?: Array<'etherlink' | 'tezos'>;
	evmNetwork?: EvmNetworkType;
	tezosBeaconNetwork?: TezosBeaconNetwork;
	tezosWcNetwork?: TezosWcNetwork;
	children?: ReactNode | undefined;
}

/**
 * `TConnectModalProvider` is a React component that provides context and state management for connecting to various blockchain networks and wallets.
 * It handles the connection logic for EVM, Tezos Beacon, and Tezos WalletConnect providers, and manages the state of the connection modal.
 *
 * @param {TConnectModalProviderProps} props - The properties for the `TConnectModalProvider` component.
 * @param {string} props.bridgeUrl - The URL of the bridge server.
 * @param {string} props.apiKey - The API key for authentication.
 * @param {string[]} props.networkFilter - An array of network filters.
 * @param {React.ReactNode} props.children - The child components to be rendered within the provider.
 * @param {(error: unknown) => void} [props.onError] - Optional callback function to handle errors.
 *
 * @returns {JSX.Element} The `TConnectModalProvider` component.
 *
 * @example
 * ```tsx
 * <TConnectModalProvider
 *   bridgeUrl="https://bridge.example.com"
 *   apiKey="your-api-key"
 *   networkFilter={['mainnet', 'testnet']}
 *   onError={(error) => console.error(error)}
 * >
 *   <YourAppComponents />
 * </TConnectModalProvider>
 * ```
 */
export const TConnectModalProvider = memo<TConnectModalProviderProps>(
	({
		appName,
		appUrl,
		appIcon,
		bridgeUrl,
		apiKey,
		networkFilter,
		evmNetwork,
		tezosBeaconNetwork,
		tezosWcNetwork,
		children,
		...props
	}) => {
		const [showModal, setShowModal] = useState(false);
		const [step, setStep] = useState<Step>('connect');
		const [currentNetwork, setCurrentNetwork] = useState<Network | undefined>(undefined);
		const [currentWallet, setCurrentWallet] = useState<Network['wallets'][0] | undefined>(undefined);
		const [evmProvider, setEvmProvider] = useVersionedState<TConnectEvmProvider | undefined>(undefined);
		const [tezosBeaconProvider, setTezosBeaconProvider] = useVersionedState<TConnectTezosBeaconProvider | undefined>(
			undefined,
		);
		const [tezosWcProvider, setTezosWcProvider] = useVersionedState<TConnectTezosWcProvider | undefined>(undefined);
		const [connected, setConnected] = useVersionedState(false);

		useEffect(() => {
			(async (): Promise<void> => {
				try {
					const item = sessionStorage.getItem(EVM_PROVIDER_STORAGE_KEY);
					if (item) {
						const version = nextVersion();
						const provider = await TConnectEvmProvider.deserialize(item);
						setEvmProvider(version, provider);
					}
				} catch (error) {
					handleError(error);
				}
			})();
		}, [setEvmProvider]);

		useEffect(() => {
			try {
				if (evmProvider) {
					sessionStorage.setItem(EVM_PROVIDER_STORAGE_KEY, evmProvider.serialize());
				} else {
					sessionStorage.removeItem(EVM_PROVIDER_STORAGE_KEY);
				}
			} catch (error) {
				handleError(error);
			}
		}, [evmProvider]);

		useEffect(() => {
			(async (): Promise<void> => {
				try {
					const item = sessionStorage.getItem(TEZOS_BEACON_PROVIDER_STORAGE_KEY);
					if (item) {
						const version = nextVersion();
						const provider = await TConnectTezosBeaconProvider.deserialize(item);
						setTezosBeaconProvider(version, provider);
					}
				} catch (error) {
					handleError(error);
				}
			})();
		}, [setTezosBeaconProvider]);

		useEffect(() => {
			try {
				if (tezosBeaconProvider) {
					sessionStorage.setItem(TEZOS_BEACON_PROVIDER_STORAGE_KEY, tezosBeaconProvider.serialize());
				} else {
					sessionStorage.removeItem(TEZOS_BEACON_PROVIDER_STORAGE_KEY);
				}
			} catch (error) {
				handleError(error);
			}
		}, [tezosBeaconProvider]);

		useEffect(() => {
			(async (): Promise<void> => {
				try {
					const item = sessionStorage.getItem(TEZOS_WC_PROVIDER_STORAGE_KEY);
					if (item) {
						const version = nextVersion();
						const provider = await TConnectTezosWcProvider.deserialize(item);
						setTezosWcProvider(version, provider);
					}
				} catch (error) {
					handleError(error);
				}
			})();
		}, [setTezosWcProvider]);

		useEffect(() => {
			try {
				if (tezosWcProvider) {
					sessionStorage.setItem(TEZOS_WC_PROVIDER_STORAGE_KEY, tezosWcProvider.serialize());
				} else {
					sessionStorage.removeItem(TEZOS_WC_PROVIDER_STORAGE_KEY);
				}
			} catch (error) {
				handleError(error);
			}
		}, [tezosWcProvider]);

		const openModal = useCallback(() => {
			try {
				if (evmProvider) {
					const network = NETWORKS.find((network) => network.type === 'evm');
					if (network) {
						const wallet = (network as EvmNetwork).wallets.find((wallet) => wallet.walletApp === evmProvider.walletApp);
						if (wallet) {
							setStep('connected');
							setCurrentNetwork(network);
							setCurrentWallet(wallet);
						}
					}
				} else if (tezosBeaconProvider) {
					const network = NETWORKS.find((network) => network.type === 'tezos');
					if (network) {
						const wallet = (network as TezosNetwork).wallets.find(
							(wallet) => wallet.bridge === 'beacon' && wallet.walletApp === tezosBeaconProvider.walletApp,
						);
						if (wallet) {
							setStep('connected');
							setCurrentNetwork(network);
							setCurrentWallet(wallet);
						}
					}
				} else if (tezosWcProvider) {
					const network = NETWORKS.find((network) => network.type === 'tezos');
					if (network) {
						const wallet = (network as TezosNetwork).wallets.find(
							(wallet) => wallet.bridge === 'wc' && wallet.walletApp === tezosWcProvider.walletApp,
						);
						if (wallet) {
							setStep('connected');
							setCurrentNetwork(network);
							setCurrentWallet(wallet);
						}
					}
				} else {
					setStep('connect');
					setCurrentNetwork(undefined);
					setCurrentWallet(undefined);
				}
				setShowModal(true);
			} catch (error) {
				handleError(error);
			}
		}, [evmProvider, tezosBeaconProvider, tezosWcProvider]);

		const closeModal = useCallback(async () => {
			try {
				setStep((prevStep) => (prevStep === 'invalidChainId' ? 'connected' : prevStep));
				setShowModal(false);
			} catch (error) {
				handleError(error);
			}
		}, []);

		const handleChangeEvmProvider = useCallback(
			async (provider: TConnectEvmProvider, chainId: bigint) => {
				try {
					if (evmProvider) {
						await evmProvider.disconnect();
					}

					provider.on('disconnect', () => {
						setEvmProvider(nextVersion(), (prevProvider) => (prevProvider === provider ? undefined : prevProvider));
					});

					setEvmProvider(nextVersion(), provider);
					if (chainId === ETHERLINK_MAINNET_CHAIN_ID || chainId === ETHERLINK_GHOSTNET_CHAIN_ID) {
						closeModal();
					}
				} catch (error) {
					handleError(error);
				}
			},
			[evmProvider, setEvmProvider, closeModal],
		);

		const handleChangeTezosBeaconProvider = useCallback(
			async (provider: TConnectTezosBeaconProvider) => {
				try {
					if (tezosBeaconProvider) {
						await tezosBeaconProvider.disconnect();
					}

					provider.on('disconnect', (): void => {
						setTezosBeaconProvider(nextVersion(), (prevProvider) =>
							prevProvider === provider ? undefined : prevProvider,
						);
					});

					setTezosBeaconProvider(nextVersion(), provider);
					closeModal();
				} catch (error) {
					handleError(error);
				}
			},
			[tezosBeaconProvider, setTezosBeaconProvider, closeModal],
		);

		const handleChangeTezosWcProvider = useCallback(
			async (provider: TConnectTezosWcProvider) => {
				try {
					if (tezosWcProvider) {
						await tezosWcProvider.disconnect();
					}

					provider.on('disconnect', (): void => {
						setTezosWcProvider(nextVersion(), (prevProvider) => (prevProvider === provider ? undefined : prevProvider));
					});

					setTezosWcProvider(nextVersion(), provider);
					closeModal();
				} catch (error) {
					handleError(error);
				}
			},
			[tezosWcProvider, setTezosWcProvider, closeModal],
		);

		useEffect(() => {
			(async (): Promise<void> => {
				try {
					const version = nextVersion();
					const tmpConnected =
						((step !== 'invalidChainId' && (await evmProvider?.connected())) || tezosBeaconProvider?.connected()) ??
						false;
					setConnected(version, tmpConnected);
				} catch (error) {
					handleError(error);
				}
			})();
		}, [step, evmProvider, tezosBeaconProvider, setConnected]);

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
			} catch (error) {
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
		]);

		const value = useMemo(
			() => ({
				openModal,
				closeModal,
				evmProvider: step === 'invalidChainId' ? undefined : evmProvider,
				tezosBeaconProvider,
				tezosWcProvider,
				connected,
			}),
			[openModal, closeModal, step, evmProvider, tezosBeaconProvider, tezosWcProvider, connected],
		);

		return (
			<TConnectModalContext.Provider value={value} {...props}>
				{children}
				{showModal && (
					<TConnectModal
						appName={appName}
						appUrl={appUrl}
						appIcon={appIcon}
						bridgeUrl={bridgeUrl}
						apiKey={apiKey}
						networkFilter={networkFilter}
						evmNetwork={evmNetwork}
						tezosBeaconNetwork={tezosBeaconNetwork}
						tezosWcNetwork={tezosWcNetwork}
						step={step}
						onChangeStep={setStep}
						currentNetwork={currentNetwork}
						onChangeCurrentNetwork={setCurrentNetwork}
						currentWallet={currentWallet}
						onChangeCurrentWallet={setCurrentWallet}
						evmProvider={evmProvider}
						onChangeEvmProvider={handleChangeEvmProvider}
						tezosBeaconProvider={tezosBeaconProvider}
						onChangeTezosBeaconProvider={handleChangeTezosBeaconProvider}
						tezosWcProvider={tezosWcProvider}
						onChangeTezosWcProvider={handleChangeTezosWcProvider}
						onDisconnect={handleDisconnect}
						onClose={closeModal}
					/>
				)}
			</TConnectModalContext.Provider>
		);
	},
);

TConnectModalProvider.displayName = 'TConnectModalProvider';

export const useTConnectModal = (): TConnectModalContextValue => useContext(TConnectModalContext);
