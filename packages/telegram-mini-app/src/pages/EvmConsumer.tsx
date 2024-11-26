import { TConnectEvmProvider } from '@tconnect.io/evm-provider';
import { useTConnectModal } from '@tconnect.io/modal';
import { Fragment, memo, useCallback, useEffect, useState } from 'react';
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

	useEffect(() => {
		const web3 = new Web3(provider);
		web3.eth.getChainId().then((chainId) => setChainId(chainId.toString()));
	}, [provider]);

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

	return (
		<Col className="gap-y-row">
			<Row className="px-pageFrame text-2xl">EVM</Row>
			<TextButton text="Disconnect" onClick={tConnect.openModal} />
			<TextButton text="Get Chain ID" onClick={getChainId} />
			<TextButton text="Get Address" onClick={getAddress} />
			{address && (
				<Fragment>
					<TextButton text="Sign" onClick={sign} />
					<TextButton text="Get Balance" onClick={getBalance} />
				</Fragment>
			)}
			<Col className="gap-y-row px-pageFrame">
				<Row className="break-all">Chain ID: {chainId}</Row>
				<Row className="break-all">Address: {address}</Row>
				<Row className="break-all">Balance: {balance}</Row>
				<Row className="break-all">Signature: {signature}</Row>
			</Col>
		</Col>
	);
});

EvmConsumer.displayName = 'EvmConsumer';
