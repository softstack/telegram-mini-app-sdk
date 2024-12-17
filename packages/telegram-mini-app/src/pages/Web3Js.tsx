import { EvmWalletApp, TConnectEvmProvider } from '@tconnect.io/evm-provider';
import { memo, useCallback, useState } from 'react';
import Web3 from 'web3';
import { Evm, Step } from '../components/Evm';
import { APP_NAME } from '../constants/constants';
import { APP_URL, BRIDGE_URL } from '../constants/environment';

export const Web3Js = memo(() => {
	const [step, setStep] = useState<Step>('start');
	const [provider, setProvider] = useState<TConnectEvmProvider | undefined>();
	const [connectionString, setConnectionString] = useState<string | undefined>();
	const [chainId, setChainId] = useState<string | undefined>();
	const [address, setAddress] = useState<string | undefined>();
	const [balance, setBalance] = useState<string | undefined>();
	const [signature, setSignature] = useState<string | undefined>();

	const connect = useCallback(async (walletApp?: EvmWalletApp) => {
		try {
			setStep('connecting');

			const provider = new TConnectEvmProvider({
				appName: APP_NAME,
				appUrl: APP_URL,
				bridgeUrl: BRIDGE_URL,
				walletApp,
				apiKey: 'a',
				network: 'ghostnet',
			});

			provider
				.on('connect', () => {
					setStep('connected');
				})
				.on('chainChanged', (chainId) => {
					setChainId(chainId);
				})
				.on('accountsChanged', (accounts) => {
					if (accounts.length > 0) {
						setAddress(accounts[0]);
					} else {
						setAddress(undefined);
					}
				})
				.on('disconnect', () => {
					setProvider(undefined);
					setAddress(undefined);
					setStep('start');
				});

			if (!walletApp) {
				provider.on('connectionString', (connectionString) => {
					setConnectionString(connectionString);
				});
			}

			setProvider(provider);
			await provider.connect();
		} catch (error) {
			console.error(error);
			setStep('start');
			setProvider(undefined);
		}
	}, []);

	const getAddress = useCallback(async () => {
		if (!provider) {
			return;
		}
		const web3 = new Web3(provider);
		const accounts = await web3.eth.getAccounts();
		if (accounts.length > 0) {
			setAddress(accounts[0]);
		}
	}, [provider]);

	const sign = useCallback(async () => {
		if (!provider || !address) {
			return;
		}
		const web3 = new Web3(provider);
		const signature = await web3.eth.personal.sign('Hello world', address, 'password');
		setSignature(signature);
	}, [provider, address]);

	const getBalance = useCallback(async () => {
		if (!provider || !address) {
			return;
		}
		const web3 = new Web3(provider);
		const balance = await web3.eth.getBalance(address);
		setBalance(balance.toString());
	}, [provider, address]);

	const disconnect = useCallback(async () => {
		if (!provider) {
			return;
		}
		await provider.disconnect();
		setProvider(undefined);
		setAddress(undefined);
		setStep('start');
	}, [provider]);

	return (
		<Evm
			step={step}
			connect={connect}
			connectionString={connectionString}
			address={address}
			chainId={chainId}
			disconnect={disconnect}
			getAddress={getAddress}
			sign={sign}
			signature={signature}
			getBalance={getBalance}
			balance={balance}
		/>
	);
});

Web3Js.displayName = 'Web3Js';
