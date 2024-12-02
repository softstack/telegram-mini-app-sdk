# @tconnect.io/modal

A React component library providing a modal interface for [Tezos](https://tezos.com) and [Etherlink](https://www.etherlink.com) wallet connections.

## Documentation

For detailed documentation, visit our [official documentation](https://t-connect.gitbook.io).

## Installation

```bash
npm install @tconnect.io/modal
```

## Example

```tsx
import { TConnectModalProvider } from '@tconnect.io/modal';

const App = () => {
	return (
		<TConnectModalProvider
			appName="your_app_name"
			appUrl="https:/.."
			bridgeUrl="https://tconnect.io"
			apiKey="your_api_key"
		>
			{/* Your app content */}
		</TConnectModalProvider>
	);
};
```

## License

[MIT License](./LICENSE.txt)
