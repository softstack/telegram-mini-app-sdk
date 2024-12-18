import { useTConnectModal } from '@tconnect.io/modal';
import { Fragment, memo } from 'react';
import { Link } from 'react-router-dom';
import { TextButton } from '../components/buttons/TextButton';
import { Col } from '../components/flex/Col';
import { TezosConsumer } from '../pages/TezosConsumer';
import { EtherlinkConsumer } from './EtherlinkConsumer';

export const Main = memo(() => {
	const tConnect = useTConnectModal();

	return (
		<Fragment>
			{tConnect.etherlinkProvider ? (
				<EtherlinkConsumer provider={tConnect.etherlinkProvider} />
			) : tConnect.tezosBeaconProvider ? (
				<TezosConsumer provider={tConnect.tezosBeaconProvider} />
			) : tConnect.tezosWcProvider ? (
				<TezosConsumer provider={tConnect.tezosWcProvider} />
			) : (
				<Col className="gap-y-row">
					<TextButton text="Connect via modal" onClick={tConnect.openModal} />
					<Col className="gap-y-row px-pageFrame">
						<Link to="/ethers">Etherlink Ethers</Link>
						<Link to="/web3js">Etherlink Web3</Link>
						<Link to="/tezos-beacon">Tezos Beacon</Link>
						<Link to="/tezos-wc">Tezos WalletConnect</Link>
					</Col>
				</Col>
			)}
		</Fragment>
	);
});

Main.displayName = 'Main';
