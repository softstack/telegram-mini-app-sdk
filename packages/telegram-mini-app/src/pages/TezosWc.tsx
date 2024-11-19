import { TezosToolkit } from '@taquito/taquito';
import { TConnectTezosWcProvider, TezosWcWalletApp } from '@tconnect.io/tezos-wc-provider';
import { QRCodeCanvas } from 'qrcode.react';
import { memo, useCallback, useState } from 'react';
import { BRIDGE_URL } from '../environment';
import { handleError } from '../utils';

export const TezosWc = memo(() => {
	const [step, setStep] = useState<'start' | 'connecting' | 'connected'>('start');
	const [tezos, setTezos] = useState<TezosToolkit | undefined>();
	const [provider, setProvider] = useState<TConnectTezosWcProvider | undefined>();
	const [connectionString, setConnectionString] = useState<string | undefined>();
	const [publicKey, setPublicKey] = useState<string | undefined>();
	const [address, setAddress] = useState<string | undefined>();
	const [balance, setBalance] = useState<string | undefined>();
	const [signature, setSignature] = useState<string | undefined>();
	const [transactionHash, setTransactionHash] = useState<string | undefined>();

	const connect = useCallback(async (walletApp?: TezosWcWalletApp) => {
		try {
			setStep('connecting');
			const tezos = new TezosToolkit('https://rpc.ghostnet.teztnets.com'); // Ghostnet
			const provider = new TConnectTezosWcProvider({
				bridgeUrl: BRIDGE_URL,
				apiKey: 'a',
				walletApp,
				network: 'ghostnet',
			});
			tezos.setWalletProvider(provider);

			if (!walletApp) {
				provider.on('connectionString', (connectionString) => {
					console.log('connectionString', connectionString);
					setConnectionString(connectionString);
				});
			}

			// provider.on('disconnect', () => {
			// 	console.log('disconnect');
			// 	setStep('start');
			// });

			await provider.permissionRequest();
			setTezos(tezos);
			setProvider(provider);
			setStep('connected');
		} catch (error) {
			handleError(error);
		}
	}, []);

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
		if (!provider) {
			return;
		}
		const bytes = Buffer.from('Hello World!').toString('hex');
		const bytesLength = (bytes.length / 2).toString(16).padStart(8, '0');
		const payload = '05' + '01' + bytesLength + bytes;
		const signature = await provider.requestSignPayload({ payload });
		setSignature(signature);
	}, [provider]);

	const transfer = useCallback(async () => {
		if (!tezos) {
			return;
		}
		const op = await tezos.wallet.transfer({ to: 'tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY', amount: 1 }).send();
		setTransactionHash(op.opHash);
	}, [tezos]);

	return (
		<div>
			<h1>Tezos WalletConnect</h1>
			{step === 'start' ? (
				<div>
					<button onClick={() => connect()}>QR Code</button>
					<button onClick={() => connect('kukai')}>Kukai</button>
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

TezosWc.displayName = 'TezosWc';
