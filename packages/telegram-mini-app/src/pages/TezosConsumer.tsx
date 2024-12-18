import { TezosToolkit, TransferParams } from '@taquito/taquito';
import { useTConnectModal } from '@tconnect.io/modal';
import { TConnectTezosBeaconProvider } from '@tconnect.io/tezos-beacon-provider';
import { TConnectTezosWcProvider } from '@tconnect.io/tezos-wc-provider';
import { memo, useCallback, useEffect, useState } from 'react';
import { TextButton } from '../components/buttons/TextButton';
import { Col } from '../components/flex/Col';
import { Row } from '../components/flex/Row';

export interface TezosConsumerProps {
	provider: TConnectTezosBeaconProvider | TConnectTezosWcProvider;
}

export const TezosConsumer = memo<TezosConsumerProps>(({ provider }) => {
	const tConnect = useTConnectModal();
	const [tezos, setTezos] = useState<TezosToolkit | undefined>();
	const [address, setAddress] = useState<string | undefined>();
	const [balance, setBalance] = useState<string | undefined>();
	const [signature, setSignature] = useState<string | undefined>();
	const [transactionHash, setTransactionHash] = useState<string | undefined>();

	useEffect(() => {
		// const tezos = new TezosToolkit('https://rpc.tzbeta.net'); // Mainnet
		const tezos = new TezosToolkit('https://rpc.ghostnet.teztnets.com'); // Ghostnet
		tezos.setWalletProvider(provider);
		setTezos(tezos);
	}, [provider]);

	const getAddress = useCallback(async () => {
		const address = await provider.getPKH();
		setAddress(address);
	}, [provider]);

	const getBalance = useCallback(async () => {
		if (!tezos) {
			return;
		}
		const balance = await tezos.tz.getBalance(await provider.getPKH());
		setBalance(balance.toString());
	}, [tezos, provider]);

	const sign = useCallback(async () => {
		const message = `Hello world! ${new Date().toISOString()}`;
		if (provider instanceof TConnectTezosWcProvider) {
			const bytes = Buffer.from(message).toString('hex');
			const bytesLength = (bytes.length / 2).toString(16).padStart(8, '0');
			const payload = '05' + '01' + bytesLength + bytes;
			const signature = await provider.requestSignPayload({ payload });
			setSignature(signature);
		} else if (provider instanceof TConnectTezosBeaconProvider) {
			const bytes = Buffer.from(message).toString('hex');
			const bytesLength = (bytes.length / 2).toString(16).padStart(8, '0');
			const payload = '05' + '01' + bytesLength + bytes;
			const { signature } = await provider.requestSignPayload({ payload });
			setSignature(signature);
		}
	}, [provider]);

	const transfer = useCallback(async () => {
		if (!tezos || !provider) {
			return;
		}
		const transferParams: TransferParams = {
			to: 'tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY',
			amount: 1,
			mutez: true,
		};
		if (provider.walletApp === 'kukai') {
			const estimation = await tezos.estimate.transfer(transferParams);
			transferParams.fee = estimation.suggestedFeeMutez;
			transferParams.gasLimit = estimation.gasLimit;
			transferParams.storageLimit = estimation.storageLimit;
		}
		const op = await tezos.wallet.transfer(transferParams).send();
		setTransactionHash(op.opHash);
	}, [tezos, provider]);

	return (
		<Col className="gap-y-row">
			<Row className="px-pageFrame text-2xl">Tezos</Row>
			<TextButton text="Disconnect" onClick={tConnect.openModal} />
			<TextButton text="Get Address" onClick={getAddress} />
			<TextButton text="Get Balance" onClick={getBalance} />
			<TextButton text="Sign" onClick={sign} />
			<TextButton text="Transfer" onClick={transfer} />
			<Col className="gap-y-row px-pageFrame">
				<Row className="break-all">Address: {address}</Row>
				<Row className="break-all">Balance: {balance}</Row>
				<Row className="break-all">Signature: {signature}</Row>
				<Row className="break-all">Transaction Hash: {transactionHash}</Row>
			</Col>
		</Col>
	);
});

TezosConsumer.displayName = 'TezosConsumer';
