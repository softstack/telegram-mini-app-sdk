import { EvmWalletApp } from '@tconnect.io/evm-provider';
import { QRCodeCanvas } from 'qrcode.react';
import { memo, useMemo } from 'react';
import { UAParser } from 'ua-parser-js';

export type Step = 'start' | 'connecting' | 'connected';

export interface EvmProps {
	step: Step;
	connect: (walletApp?: EvmWalletApp) => void;
	connectionString: string | undefined;
	chainId: string | undefined;
	disconnect: () => void;
	getAddress: () => void;
	address: string | undefined;
	sign: () => void;
	signature: string | undefined;
	getBalance: () => void;
	balance: string | undefined;
}

export const Evm = memo<EvmProps>(
	({
		step,
		connect,
		connectionString,
		chainId,
		disconnect,
		getAddress,
		address,
		sign,
		signature,
		getBalance,
		balance,
	}) => {
		const os = useMemo(() => {
			const parser = new UAParser();
			return parser.getOS().name;
		}, []);

		return (
			<div>
				{step === 'start' ? (
					<div>
						<button onClick={() => connect()}>QR Code</button>
						<button onClick={() => connect('bitget')}>Bitget</button>
						<button onClick={() => connect('metaMask')}>Meta Mask</button>
						<button onClick={() => connect('rainbow')}>Rainbow</button>
						<button onClick={() => connect('safePal')}>SafePal</button>
						<button onClick={() => connect('trust')}>Trust</button>
					</div>
				) : step === 'connecting' ? (
					<div>
						<div>Connecting...</div>
						<div>{connectionString && <QRCodeCanvas value={connectionString} size={256} />}</div>
					</div>
				) : step === 'connected' ? (
					<div>
						<button onClick={disconnect}>Disconnect</button>
						<button onClick={getAddress}>Get Address</button>
						{address && (
							<>
								<button onClick={sign}>Sign</button>
								<button onClick={getBalance}>Get Balance</button>
							</>
						)}
						<div>Chain ID: {chainId}</div>
						<div>Address: {address}</div>
						<div>Balance: {balance}</div>
						<div>Signature: {signature}</div>
					</div>
				) : undefined}
				<div>OS: {os}</div>
			</div>
		);
	},
);

Evm.displayName = 'Evm';
