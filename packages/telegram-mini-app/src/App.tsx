import { TConnectModalProvider } from '@tconnect.io/modal';
import { Fragment, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Bounce, ToastContainer } from 'react-toastify';
import { Col } from './components/flex/Col';
import { APP_NAME } from './constants/constants';
import { API_KEY, APP_ICON, APP_URL, BRIDGE_URL } from './constants/environment';
import { Ethers } from './pages/Ethers';
import { Fallback } from './pages/Fallback';
import { Main } from './pages/Main';
import { TezosBeacon } from './pages/TezosBeacon';
import { TezosWc } from './pages/TezosWc';
import { Web3Js } from './pages/Web3Js';

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

		globalThis.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', listener);
		if (globalThis.matchMedia('(prefers-color-scheme: dark)').matches) {
			document.body.classList.add('dark-mode');
		}

		return (): void => {
			globalThis.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', listener);
		};
	}, []);

	return (
		<Fragment>
			<TConnectModalProvider
				appName={APP_NAME}
				appUrl={APP_URL}
				appIcon={APP_ICON}
				bridgeUrl={BRIDGE_URL}
				apiKey={API_KEY}
				tezosBeaconNetwork={{ type: 'ghostnet' }}
				tezosWcNetwork="ghostnet"
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
