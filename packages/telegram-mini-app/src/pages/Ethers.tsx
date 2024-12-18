import { EtherlinkWalletApp, TConnectEtherlinkProvider } from '@tconnect.io/etherlink-provider';
import { ethers } from 'ethers';
import { memo, useCallback, useState } from 'react';
import { Etherlink, Step } from '../components/Etherlink';
import { APP_NAME } from '../constants/constants';
import { APP_URL, BRIDGE_URL } from '../constants/environment';

export const Ethers = memo(() => {
	const [step, setStep] = useState<Step>('start');
	const [eipProvider, setEipProvider] = useState<TConnectEtherlinkProvider | undefined>();
	const [connectionString, setConnectionString] = useState<string | undefined>();
	const [chainId, setChainId] = useState<string | undefined>();
	const [address, setAddress] = useState<string | undefined>();
	const [balance, setBalance] = useState<string | undefined>();
	const [signature, setSignature] = useState<string | undefined>();

	const connect = useCallback(async (walletApp?: EtherlinkWalletApp) => {
		try {
			setStep('connecting');

			const provider = new TConnectEtherlinkProvider({
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
					setEipProvider(undefined);
					setAddress(undefined);
					setStep('start');
				})
				.on('connectionString', (connectionString) => {
					setConnectionString(connectionString);
				});

			setEipProvider(provider);
			await provider.connect();
		} catch (error) {
			console.error(error);
			setStep('start');
			setEipProvider(undefined);
		}
	}, []);

	const getAddress = useCallback(async () => {
		if (!eipProvider) {
			return;
		}
		const provider = new ethers.BrowserProvider(eipProvider);
		const signer = await provider.getSigner();
		const address = await signer.getAddress();
		setAddress(address);
	}, [eipProvider]);

	const sign = useCallback(async () => {
		if (!eipProvider || !address) {
			return;
		}
		const provider = new ethers.BrowserProvider(eipProvider);
		const signer = await provider.getSigner();
		const signature = await signer.signMessage('Hello world');
		setSignature(signature);
	}, [eipProvider, address]);

	const getBalance = useCallback(async () => {
		if (!eipProvider || !address) {
			return;
		}
		const provider = new ethers.BrowserProvider(eipProvider);
		const balance = await provider.getBalance(address);
		setBalance(balance.toString());
	}, [eipProvider, address]);

	const disconnect = useCallback(async () => {
		if (!eipProvider) {
			return;
		}
		await eipProvider.disconnect();
		setEipProvider(undefined);
		setAddress(undefined);
		setStep('start');
	}, [eipProvider]);

	return (
		<Etherlink
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

Ethers.displayName = 'Ethers';
