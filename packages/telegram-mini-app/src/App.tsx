import { TConnectModalProvider } from '@tconnect.io/modal';
import { Fragment, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Col } from 'telegram-mini-app/src/components/flex/Col';
import { API_KEY, BRIDGE_URL, GENERIC_WALLET_URL } from './environment';
import { Ethers } from './pages/Ethers';
import { Fallback } from './pages/Fallback';
import { Main } from './pages/Main';
import { TezosBeacon } from './pages/TezosBeacon';
import { TezosWc } from './pages/TezosWc';
import { Web3Js } from './pages/Web3Js';
import { handleError } from './utils';

const router = createBrowserRouter([
	{ path: '/', element: <Main /> },
	{ path: '/ethers', element: <Ethers /> },
	{ path: '/web3js', element: <Web3Js /> },
	{ path: '/tezos-beacon', element: <TezosBeacon /> },
	{ path: '/tezos-wc', element: <TezosWc /> },
	{ path: '/fallback', element: <Fallback /> },
]);

export const App = (): JSX.Element => {
	useEffect(() => {
		const listener = (event: MediaQueryListEvent): void => {
			if (event.matches) {
				document.body.classList.add('dark-mode');
			} else {
				document.body.classList.remove('dark-mode');
			}
		};

		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', listener);
		if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			document.body.classList.add('dark-mode');
		}

		return (): void => {
			window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', listener);
		};
	}, []);

	return (
		<Fragment>
			<TConnectModalProvider
				bridgeUrl={BRIDGE_URL}
				apiKey={API_KEY}
				genericWalletUrl={GENERIC_WALLET_URL}
				onError={handleError}
			>
				<Col className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
					<RouterProvider router={router} />
				</Col>
			</TConnectModalProvider>
			<ToastContainer
				position="top-center"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="colored"
				transition={Bounce}
			/>
		</Fragment>
	);
};
