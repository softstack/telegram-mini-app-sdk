import { TConnectEvmProvider } from '@tconnect.io/evm-provider';
import { useTConnectModal } from '@tconnect.io/modal';
import { Fragment, memo, useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import Web3 from 'web3';
import { TextButton } from '../components/buttons/TextButton';
import { Col } from '../components/flex/Col';
import { Row } from '../components/flex/Row';

export interface EvmConsumerProps {
	provider: TConnectEvmProvider;
}

export const EvmConsumer = memo<EvmConsumerProps>(({ provider }) => {
	const tConnect = useTConnectModal();
	const [chainId, setChainId] = useState<string | undefined>();
	const [address, setAddress] = useState<string | undefined>();
	const [balance, setBalance] = useState<string | undefined>();
	const [signature, setSignature] = useState<string | undefined>();
	const [transactionHash, setTransactionHash] = useState<string | undefined>();

	const getChainId = useCallback(async () => {
		const web3 = new Web3(provider);
		const chainId = await web3.eth.getChainId();
		setChainId(chainId.toString());
	}, [provider]);

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
		const signature = await web3.eth.personal.sign(`Hello world! ${new Date().toISOString()}`, address, 'password');
		setSignature(signature);
	}, [provider, address]);

	const getBalance = useCallback(async () => {
		try {
			if (!provider || !address) {
				return;
			}
			const web3 = new Web3(provider);
			const balance = await web3.eth.getBalance(address);
			setBalance(balance.toString());
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error('An error occurred');
			}
		}
	}, [provider, address]);

	const transfer = useCallback(async () => {
		try {
			if (!provider || !address) {
				return;
			}
			const web3 = new Web3(provider);
			const nonce = await web3.eth.getTransactionCount(address);
			const chainId = await web3.eth.getChainId();
			const transactionReceipt = await web3.eth.sendTransaction({
				from: address,
				to: address,
				value: '0x1',
				nonce: '0x' + nonce.toString(16),
				chainId: '0x' + chainId.toString(16),
			});
			setTransactionHash('0x' + Buffer.from(transactionReceipt.transactionHash).toString('hex'));
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error('An error occurred');
			}
		}
	}, [provider, address]);

	return (
		<Col className="gap-y-row">
			<Row className="px-pageFrame text-2xl">EVM</Row>
			<TextButton text="Disconnect" onClick={tConnect.openModal} />
			<TextButton text="Get Chain ID" onClick={getChainId} />
			<TextButton text="Get Address" onClick={getAddress} />
			{address && (
				<Fragment>
					<TextButton text="Get Balance" onClick={getBalance} />
					<TextButton text="Sign" onClick={sign} />
					<TextButton text="Transfer" onClick={transfer} />
				</Fragment>
			)}
			<Col className="gap-y-row px-pageFrame">
				<Row className="break-all">Chain ID: {chainId}</Row>
				<Row className="break-all">Address: {address}</Row>
				<Row className="break-all">Balance: {balance && balance + ' XTZ'}</Row>
				<Row className="break-all">Signature: {signature}</Row>
				<Row className="break-all">Transaction Hash: {transactionHash}</Row>
			</Col>
		</Col>
	);
});

EvmConsumer.displayName = 'EvmConsumer';
