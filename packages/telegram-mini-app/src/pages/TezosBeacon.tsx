import { TezosToolkit } from '@taquito/taquito';
import { TConnectTezosBeaconProvider, TezosBeaconWalletApp } from '@tconnect.io/tezos-beacon-provider';
import { QRCodeCanvas } from 'qrcode.react';
import { memo, useCallback, useMemo, useState } from 'react';
import { APP_NAME } from '../constants/constants';
import { APP_URL, BRIDGE_URL, GENERIC_WALLET_URL } from '../constants/environment';

export const TezosBeacon = memo(() => {
	const [step, setStep] = useState<'start' | 'connecting' | 'connected'>('start');
	const [tezos, setTezos] = useState<TezosToolkit | undefined>();
	const [provider, setProvider] = useState<TConnectTezosBeaconProvider | undefined>();
	const [connectionString, setConnectionString] = useState<string | undefined>();
	const [publicKey, setPublicKey] = useState<string | undefined>();
	const [address, setAddress] = useState<string | undefined>();
	const [balance, setBalance] = useState<string | undefined>();
	const [signature, setSignature] = useState<string | undefined>();
	const [transactionHash, setTransactionHash] = useState<string | undefined>();

	const secretSeed = useMemo(() => {
		const secretSeed = crypto.randomUUID();
		// const secretSeed = '83a56f5c-2b88-4c94-9ee5-5303ca72cc71';
		console.log('secretSeed', secretSeed);
		return secretSeed;
	}, []);

	const connect = useCallback(
		async (walletApp?: TezosBeaconWalletApp) => {
			setStep('connecting');
			const tezos = new TezosToolkit('https://rpc.ghostnet.teztnets.com'); // Ghostnet
			const provider = new TConnectTezosBeaconProvider({
				appName: APP_NAME,
				appUrl: APP_URL,
				bridgeUrl: BRIDGE_URL,
				secretSeed,
				apiKey: 'a',
				network: { type: 'ghostnet', name: 'Ghostnet', rpcUrl: 'https://rpc.ghostnet.teztnets.com' },
				walletApp,
				genericWalletUrl: GENERIC_WALLET_URL,
			});
			tezos.setWalletProvider(provider);

			if (!walletApp) {
				provider.on('connectionString', (connectionString) => {
					console.log('connectionString', connectionString);
					setConnectionString(connectionString);
				});
			}

			provider.on('disconnect', () => {
				console.log('disconnect');
				setStep('start');
			});

			await provider.permissionRequest();
			setTezos(tezos);
			setProvider(provider);
			setStep('connected');
		},
		[secretSeed],
	);

	const getPublicKey = useCallback(async () => {
		if (!provider) {
			return;
		}
		const publicKey = await provider.getPK();
		setPublicKey(publicKey);
	}, [provider]);

	const getAddress = useCallback(async () => {
		if (!provider) {
			return;
		}
		const address = await provider.getPKH();
		setAddress(address);
	}, [provider]);

	const getBalance = useCallback(async () => {
		if (!tezos || !provider) {
			return;
		}
		const balance = await tezos.tz.getBalance(await provider.getPKH());
		setBalance(balance.toString());
	}, [tezos, provider]);

	const sign = useCallback(async () => {
		if (!tezos) {
			return;
		}
		const response = await tezos.wallet.signFailingNoop({
			arbitrary: Buffer.from('Hello World!').toString('hex'),
			basedOnBlock: 'head',
		});
		setSignature(response.signature);
	}, [tezos]);

	const transfer = useCallback(async () => {
		if (!tezos) {
			return;
		}
		const op = await tezos.wallet.transfer({ to: 'tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY', amount: 1 }).send();
		setTransactionHash(op.opHash);
	}, [tezos]);

	return (
		<div>
			<h1>Tezos Beacon</h1>
			{step === 'start' ? (
				<div>
					<button onClick={() => connect()}>QR Code</button>
					<button onClick={() => connect('altme')}>Altme</button>
				</div>
			) : step === 'connecting' ? (
				<div>
					<div>Connecting...</div>
					{connectionString && (
						<div className="p-2">
							<QRCodeCanvas value={connectionString} size={256} />
						</div>
					)}
				</div>
			) : step === 'connected' ? (
				<div>
					<button onClick={getPublicKey}>Get Public Key</button>
					<button onClick={getAddress}>Get Address</button>
					<button onClick={getBalance}>Get Balance</button>
					<button onClick={sign}>Sign</button>
					<button onClick={transfer}>Transfer</button>
					<div>Public Key: {publicKey}</div>
					<div>Address: {address}</div>
					<div>Balance: {balance}</div>
					<div>Signature: {signature}</div>
					<div>Transaction Hash: {transactionHash}</div>
				</div>
			) : undefined}
		</div>
	);
});

TezosBeacon.displayName = 'TezosBeacon';
